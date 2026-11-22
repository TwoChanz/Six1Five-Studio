<#
.SYNOPSIS
    Optimize Projects folder for transfer: cleanup, archive old projects, and robocopy to LiveProjects

.DESCRIPTION
    This script performs a comprehensive project folder optimization:
    1. Scan and generate size/type reports
    2. Clean up build artifacts, caches, and temporary files
    3. Archive inactive projects (not modified in X days)
    4. Transfer curated contents via robocopy
    5. Verify transfer integrity

.PARAMETER SafetyDryRun
    When $true (default), performs read-only analysis without destructive changes.
    Cleanup/archive only report actions, robocopy uses /L (list-only).

.PARAMETER SourceRoot
    Source directory to optimize (default: C:\Projects)

.PARAMETER DestRoot
    Destination for optimized transfer (default: E:\LiveProjects)

.PARAMETER ArchiveRoot
    Archive location for old/inactive projects (default: E:\ArchivedProjects)

.PARAMETER ReportDir
    Output directory for all logs and CSV reports (default: C:\Projects\_transfer_reports)

.PARAMETER AgeDaysForArchive
    Archive projects not modified in this many days (default: 45)

.EXAMPLE
    .\optimize-projects.ps1 -SafetyDryRun:$true
    Dry run - analyze without making changes

.EXAMPLE
    .\optimize-projects.ps1 -SafetyDryRun:$false -AgeDaysForArchive 60
    Execute full optimization, archive projects older than 60 days
#>

[CmdletBinding()]
param(
    [Parameter(Mandatory=$false)]
    [switch]$SafetyDryRun = $true,

    [Parameter(Mandatory=$false)]
    [string]$SourceRoot = "C:\Projects",

    [Parameter(Mandatory=$false)]
    [string]$DestRoot = "E:\LiveProjects",

    [Parameter(Mandatory=$false)]
    [string]$ArchiveRoot = "E:\ArchivedProjects",

    [Parameter(Mandatory=$false)]
    [string]$ReportDir = "C:\Projects\_transfer_reports",

    [Parameter(Mandatory=$false)]
    [int]$AgeDaysForArchive = 45,

    [Parameter(Mandatory=$false)]
    [bool]$DoCleanup = $true,

    [Parameter(Mandatory=$false)]
    [bool]$DoArchiveOld = $true,

    [Parameter(Mandatory=$false)]
    [bool]$DoTransfer = $true
)

# ============================================================================
# CONFIGURATION
# ============================================================================

$ErrorActionPreference = "Stop"
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"

# Exclusion patterns
$ExcludeDirs = @(
    "node_modules",".next","dist","build","temp","tmp","logs","__pycache__",".cache",
    ".gradle",".venv",".mypy_cache","obj","bin",".vscode",".idea",".tox",
    ".pytest_cache",".ruff_cache",".parcel-cache",".turbo",".nuxt",".angular",
    "coverage","site","htmlcov","_site",".sass-cache",".bundle","Pods","DerivedData",
    # AEC / 3D / Media common heavy outputs
    "Metashape\cache","Metashape\build","RealityCapture\Cache","RealityCapture\TEMP",
    "RC\Cache","RC\TMP","Blender\cache","exports","renders","render_cache","proxies",
    ".gallery",".lrdata",".mediaCache",".peakFiles",".thumbnails"
)

$ExcludeFiles = @(
    "*.tmp","*.log","Thumbs.db",".DS_Store","desktop.ini","*.lock",
    "*.bak","*.old","*.orig"
)

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

function Write-Log {
    param([string]$Message, [string]$Color = "White")
    $logMsg = "[{0}] {1}" -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss"), $Message
    Write-Host $logMsg -ForegroundColor $Color
}

function Write-Banner {
    param([string]$Title)
    Write-Host ""
    Write-Host ("=" * 80) -ForegroundColor Cyan
    Write-Host "  $Title" -ForegroundColor Cyan
    Write-Host ("=" * 80) -ForegroundColor Cyan
}

function Test-PathSafety {
    param([string]$Path, [string]$AllowedRoot)

    try {
        $resolvedPath = Resolve-Path -Path $Path -ErrorAction SilentlyContinue
        $resolvedRoot = Resolve-Path -Path $AllowedRoot -ErrorAction SilentlyContinue

        if (-not $resolvedPath) { return $true } # Path doesn't exist yet, allow
        if (-not $resolvedRoot) {
            Write-Log "ERROR: Root path does not exist: $AllowedRoot" -Color Red
            return $false
        }

        $pathStr = $resolvedPath.Path.TrimEnd('\')
        $rootStr = $resolvedRoot.Path.TrimEnd('\')

        if ($pathStr -like "$rootStr*") {
            return $true
        } else {
            Write-Log "ERROR: Path $Path is outside allowed root $AllowedRoot" -Color Red
            return $false
        }
    } catch {
        Write-Log "ERROR: Path validation failed: $_" -Color Red
        return $false
    }
}

function Get-FolderSize {
    param([string]$Path)

    try {
        $size = Get-ChildItem -Path $Path -Recurse -Force -File -ErrorAction SilentlyContinue |
                Measure-Object -Property Length -Sum -ErrorAction SilentlyContinue |
                Select-Object -ExpandProperty Sum

        if ($null -eq $size) { return 0 }
        return $size
    } catch {
        return 0
    }
}

function Get-FolderFileCount {
    param([string]$Path)

    try {
        $count = (Get-ChildItem -Path $Path -Recurse -Force -File -ErrorAction SilentlyContinue |
                  Measure-Object).Count
        return $count
    } catch {
        return 0
    }
}

# ============================================================================
# VALIDATION
# ============================================================================

Write-Banner "PROJECT OPTIMIZATION TOOL - $(if($SafetyDryRun){'DRY RUN MODE'}else{'LIVE MODE'})"

Write-Log "Validating paths..." -Color Yellow

if (-not (Test-Path $SourceRoot)) {
    Write-Log "ERROR: Source directory does not exist: $SourceRoot" -Color Red
    exit 1
}

# Create required directories
@($ReportDir, $ArchiveRoot, "$ArchiveRoot\_raw_moved") | ForEach-Object {
    if (-not (Test-Path $_)) {
        Write-Log "Creating directory: $_" -Color Green
        New-Item -ItemType Directory -Path $_ -Force | Out-Null
    }
}

if ($DoTransfer -and -not (Test-Path $DestRoot)) {
    Write-Log "Creating destination: $DestRoot" -Color Green
    New-Item -ItemType Directory -Path $DestRoot -Force | Out-Null
}

# Setup report file paths
$reportFiles = @{
    TopFolders = Join-Path $ReportDir "${timestamp}_TopFoldersBySize.csv"
    FileTypes  = Join-Path $ReportDir "${timestamp}_FileTypeBreakdown.csv"
    Cleanup    = Join-Path $ReportDir "${timestamp}_CleanupLog.txt"
    Archive    = Join-Path $ReportDir "${timestamp}_ArchiveLog.txt"
    Transfer   = Join-Path $ReportDir "${timestamp}_TransferLog.txt"
    Verification = Join-Path $ReportDir "${timestamp}_Verification.csv"
    Summary    = Join-Path $ReportDir "${timestamp}_Summary.txt"
}

Write-Log "Reports will be saved to: $ReportDir" -Color Cyan

# ============================================================================
# PHASE 1: INITIAL SCAN & REPORTING
# ============================================================================

Write-Banner "PHASE 1: Scanning Source Directory"

Write-Log "Scanning: $SourceRoot" -Color Yellow
Write-Log "This may take several minutes for large directories..." -Color Gray

# Get all top-level project folders
$topFolders = Get-ChildItem -Path $SourceRoot -Directory -Force -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -notmatch '^_' } # Skip internal folders like _transfer_reports

$folderStats = @()
$totalInitialSize = 0
$totalInitialFiles = 0

foreach ($folder in $topFolders) {
    Write-Progress -Activity "Scanning folders" -Status $folder.Name

    $size = Get-FolderSize -Path $folder.FullName
    $fileCount = Get-FolderFileCount -Path $folder.FullName

    $totalInitialSize += $size
    $totalInitialFiles += $fileCount

    $folderStats += [PSCustomObject]@{
        Name = $folder.Name
        Path = $folder.FullName
        SizeMB = [math]::Round($size / 1MB, 2)
        FileCount = $fileCount
        LastWriteTime = $folder.LastWriteTime
        DaysSinceModified = [math]::Round((New-TimeSpan -Start $folder.LastWriteTime -End (Get-Date)).TotalDays, 1)
    }
}

Write-Progress -Activity "Scanning folders" -Completed

# Sort by size descending and export
$folderStats | Sort-Object SizeMB -Descending | Export-Csv -Path $reportFiles.TopFolders -NoTypeInformation
Write-Log "Saved: $($reportFiles.TopFolders)" -Color Green

# File type breakdown
Write-Log "Analyzing file types..." -Color Yellow

$allFiles = Get-ChildItem -Path $SourceRoot -Recurse -Force -File -ErrorAction SilentlyContinue
$fileTypeStats = $allFiles |
    Group-Object Extension |
    ForEach-Object {
        $totalSize = ($_.Group | Measure-Object -Property Length -Sum).Sum
        [PSCustomObject]@{
            Extension = if ($_.Name) { $_.Name } else { "(no extension)" }
            Count = $_.Count
            TotalMB = [math]::Round($totalSize / 1MB, 2)
        }
    } |
    Sort-Object TotalMB -Descending

$fileTypeStats | Export-Csv -Path $reportFiles.FileTypes -NoTypeInformation
Write-Log "Saved: $($reportFiles.FileTypes)" -Color Green

Write-Log "Initial scan complete:" -Color Cyan
Write-Log "  Total folders: $($folderStats.Count)" -Color White
Write-Log "  Total files: $totalInitialFiles" -Color White
Write-Log "  Total size: $([math]::Round($totalInitialSize / 1GB, 2)) GB" -Color White

# ============================================================================
# PHASE 2: CLEANUP (Remove build artifacts, caches, temp files)
# ============================================================================

$cleanupStats = @{
    DirsRemoved = 0
    FilesRemoved = 0
    SpaceFreed = 0
}

if ($DoCleanup) {
    Write-Banner "PHASE 2: Cleanup Build Artifacts & Caches"

    if ($SafetyDryRun) {
        Write-Log "DRY RUN: Cleanup actions will be logged but NOT executed" -Color Yellow
    }

    $cleanupLog = @()
    $cleanupLog += "Cleanup Log - $(Get-Date)"
    $cleanupLog += "Mode: $(if($SafetyDryRun){'DRY RUN'}else{'LIVE'})"
    $cleanupLog += "=" * 80
    $cleanupLog += ""

    # Find excluded directories
    Write-Log "Searching for excluded directories..." -Color Yellow

    $excludedDirs = @()
    foreach ($excludePattern in $ExcludeDirs) {
        $found = Get-ChildItem -Path $SourceRoot -Recurse -Force -Directory -ErrorAction SilentlyContinue |
            Where-Object { $_.Name -eq $excludePattern }
        $excludedDirs += $found
    }

    Write-Log "Found $($excludedDirs.Count) directories to remove" -Color Cyan

    foreach ($dir in $excludedDirs) {
        if (-not (Test-PathSafety -Path $dir.FullName -AllowedRoot $SourceRoot)) {
            Write-Log "SAFETY: Skipping directory outside source root: $($dir.FullName)" -Color Red
            continue
        }

        $dirSize = Get-FolderSize -Path $dir.FullName
        $dirSizeMB = [math]::Round($dirSize / 1MB, 2)

        $logEntry = "DIR: $($dir.FullName) ($dirSizeMB MB)"
        $cleanupLog += $logEntry

        if ($SafetyDryRun) {
            Write-Log "[DRY RUN] Would remove: $($dir.FullName) ($dirSizeMB MB)" -Color Gray
        } else {
            try {
                Remove-Item -Path $dir.FullName -Recurse -Force -ErrorAction Stop
                Write-Log "Removed: $($dir.FullName) ($dirSizeMB MB)" -Color Green
                $cleanupStats.DirsRemoved++
                $cleanupStats.SpaceFreed += $dirSize
            } catch {
                Write-Log "Failed to remove: $($dir.FullName) - $_" -Color Red
                $cleanupLog += "  ERROR: $_"
            }
        }
    }

    # Find excluded files
    Write-Log "Searching for excluded files..." -Color Yellow

    $excludedFiles = @()
    foreach ($excludePattern in $ExcludeFiles) {
        $found = Get-ChildItem -Path $SourceRoot -Recurse -Force -File -Filter $excludePattern -ErrorAction SilentlyContinue
        $excludedFiles += $found
    }

    Write-Log "Found $($excludedFiles.Count) files to remove" -Color Cyan

    foreach ($file in $excludedFiles) {
        if (-not (Test-PathSafety -Path $file.FullName -AllowedRoot $SourceRoot)) {
            Write-Log "SAFETY: Skipping file outside source root: $($file.FullName)" -Color Red
            continue
        }

        $fileSizeMB = [math]::Round($file.Length / 1MB, 2)

        $logEntry = "FILE: $($file.FullName) ($fileSizeMB MB)"
        $cleanupLog += $logEntry

        if ($SafetyDryRun) {
            Write-Log "[DRY RUN] Would remove: $($file.FullName) ($fileSizeMB MB)" -Color Gray
        } else {
            try {
                Remove-Item -Path $file.FullName -Force -ErrorAction Stop
                $cleanupStats.FilesRemoved++
                $cleanupStats.SpaceFreed += $file.Length
            } catch {
                Write-Log "Failed to remove: $($file.FullName) - $_" -Color Red
                $cleanupLog += "  ERROR: $_"
            }
        }
    }

    $cleanupLog += ""
    $cleanupLog += "=" * 80
    $cleanupLog += "Summary:"
    $cleanupLog += "  Directories removed: $($cleanupStats.DirsRemoved)"
    $cleanupLog += "  Files removed: $($cleanupStats.FilesRemoved)"
    $cleanupLog += "  Space freed: $([math]::Round($cleanupStats.SpaceFreed / 1GB, 2)) GB"

    $cleanupLog | Out-File -FilePath $reportFiles.Cleanup -Encoding UTF8
    Write-Log "Saved: $($reportFiles.Cleanup)" -Color Green

    Write-Log "Cleanup complete:" -Color Cyan
    Write-Log "  Directories: $($cleanupStats.DirsRemoved)" -Color White
    Write-Log "  Files: $($cleanupStats.FilesRemoved)" -Color White
    Write-Log "  Space freed: $([math]::Round($cleanupStats.SpaceFreed / 1GB, 2)) GB" -Color White
} else {
    Write-Log "Cleanup phase skipped (DoCleanup = $false)" -Color Gray
}

# ============================================================================
# PHASE 3: ARCHIVE OLD PROJECTS
# ============================================================================

$archiveStats = @{
    ProjectsArchived = 0
    SpaceArchived = 0
}

if ($DoArchiveOld) {
    Write-Banner "PHASE 3: Archive Inactive Projects"

    if ($SafetyDryRun) {
        Write-Log "DRY RUN: Archive actions will be logged but NOT executed" -Color Yellow
    }

    $archiveLog = @()
    $archiveLog += "Archive Log - $(Get-Date)"
    $archiveLog += "Mode: $(if($SafetyDryRun){'DRY RUN'}else{'LIVE'})"
    $archiveLog += "Archive threshold: $AgeDaysForArchive days"
    $archiveLog += "=" * 80
    $archiveLog += ""

    $oldProjects = $folderStats | Where-Object { $_.DaysSinceModified -gt $AgeDaysForArchive }

    Write-Log "Found $($oldProjects.Count) projects inactive for >$AgeDaysForArchive days" -Color Cyan

    foreach ($project in $oldProjects) {
        $projectName = $project.Name
        $projectPath = $project.Path
        $dateSuffix = Get-Date -Format "yyyyMMdd"
        $zipName = "${projectName}_${dateSuffix}.zip"
        $zipPath = Join-Path $ArchiveRoot $zipName
        $movedPath = Join-Path "$ArchiveRoot\_raw_moved" "${projectName}_${dateSuffix}"

        $logEntry = "PROJECT: $projectName (Modified: $($project.LastWriteTime), Size: $($project.SizeMB) MB)"
        $archiveLog += $logEntry
        Write-Log "Processing: $projectName ($($project.SizeMB) MB, $($project.DaysSinceModified) days old)" -Color Yellow

        if ($SafetyDryRun) {
            $archiveLog += "  [DRY RUN] Would create: $zipPath"
            $archiveLog += "  [DRY RUN] Would move to: $movedPath"
            Write-Log "[DRY RUN] Would archive: $projectName" -Color Gray
        } else {
            try {
                # Create zip with exclusions
                Write-Log "  Creating archive: $zipName" -Color Gray

                # Get all files except excluded patterns
                $filesToZip = Get-ChildItem -Path $projectPath -Recurse -File -Force -ErrorAction SilentlyContinue |
                    Where-Object {
                        $file = $_
                        $relativePath = $file.FullName.Substring($projectPath.Length)

                        # Check if file matches any exclude pattern
                        $excludeFile = $false
                        foreach ($pattern in $ExcludeFiles) {
                            if ($file.Name -like $pattern) {
                                $excludeFile = $true
                                break
                            }
                        }

                        # Check if file is in any excluded directory
                        $inExcludedDir = $false
                        foreach ($excludeDir in $ExcludeDirs) {
                            if ($relativePath -match "\\$excludeDir\\") {
                                $inExcludedDir = $true
                                break
                            }
                        }

                        -not $excludeFile -and -not $inExcludedDir
                    }

                if ($filesToZip.Count -gt 0) {
                    # Create temporary file list for selective compression
                    $tempList = Join-Path $env:TEMP "archive_$projectName.txt"
                    $filesToZip | Select-Object -ExpandProperty FullName | Out-File -FilePath $tempList -Encoding UTF8

                    # Use Compress-Archive
                    Compress-Archive -Path $filesToZip.FullName -DestinationPath $zipPath -CompressionLevel Optimal -Force

                    Remove-Item -Path $tempList -Force -ErrorAction SilentlyContinue

                    $archiveLog += "  Created: $zipPath"
                    Write-Log "  Archive created successfully" -Color Green

                    # Move original folder to _raw_moved
                    Move-Item -Path $projectPath -Destination $movedPath -Force
                    $archiveLog += "  Moved to: $movedPath"
                    Write-Log "  Original moved to: $movedPath" -Color Green

                    $archiveStats.ProjectsArchived++
                    $archiveStats.SpaceArchived += ($project.SizeMB * 1MB)
                } else {
                    $archiveLog += "  WARNING: No files to archive after applying exclusions"
                    Write-Log "  No files to archive" -Color Yellow
                }

            } catch {
                $archiveLog += "  ERROR: $_"
                Write-Log "  Failed to archive: $_" -Color Red
            }
        }

        $archiveLog += ""
    }

    $archiveLog += "=" * 80
    $archiveLog += "Summary:"
    $archiveLog += "  Projects archived: $($archiveStats.ProjectsArchived)"
    $archiveLog += "  Space archived: $([math]::Round($archiveStats.SpaceArchived / 1GB, 2)) GB"

    $archiveLog | Out-File -FilePath $reportFiles.Archive -Encoding UTF8
    Write-Log "Saved: $($reportFiles.Archive)" -Color Green

    Write-Log "Archive complete:" -Color Cyan
    Write-Log "  Projects archived: $($archiveStats.ProjectsArchived)" -Color White
    Write-Log "  Space archived: $([math]::Round($archiveStats.SpaceArchived / 1GB, 2)) GB" -Color White
} else {
    Write-Log "Archive phase skipped (DoArchiveOld = $false)" -Color Gray
}

# ============================================================================
# PHASE 4: TRANSFER TO LIVEPROJECTS
# ============================================================================

if ($DoTransfer) {
    Write-Banner "PHASE 4: Transfer to LiveProjects"

    if ($SafetyDryRun) {
        Write-Log "DRY RUN: Using robocopy /L (list-only mode)" -Color Yellow
    }

    # Build robocopy exclusion arguments
    $xdArgs = $ExcludeDirs | ForEach-Object { "/XD `"$_`"" }
    $xfArgs = $ExcludeFiles | ForEach-Object { "/XF `"$_`"" }

    $robocopyArgs = @(
        "`"$SourceRoot`"",
        "`"$DestRoot`"",
        "/E",           # Copy subdirectories, including empty ones
        "/COPY:DAT",    # Copy data, attributes, timestamps
        "/DCOPY:DAT",   # Copy directory timestamps
        "/R:2",         # Retry 2 times on failed copies
        "/W:2",         # Wait 2 seconds between retries
        "/MT:16",       # Multi-threaded (16 threads)
        "/NFL",         # No file list
        "/NDL",         # No directory list
        "/NP"           # No progress percentage
    )

    if ($SafetyDryRun) {
        $robocopyArgs += "/L"  # List only, don't copy
    }

    $robocopyArgs += $xdArgs
    $robocopyArgs += $xfArgs

    $robocopyCmd = "robocopy " + ($robocopyArgs -join " ")

    Write-Log "Executing robocopy..." -Color Yellow
    Write-Log "Command: $robocopyCmd" -Color Gray

    # Execute robocopy and capture output
    $robocopyOutput = & cmd /c $robocopyCmd 2>&1

    # Save output to log
    $robocopyOutput | Out-File -FilePath $reportFiles.Transfer -Encoding UTF8
    Write-Log "Saved: $($reportFiles.Transfer)" -Color Green

    # Parse robocopy exit code
    $robocopyExitCode = $LASTEXITCODE
    $robocopySuccess = $robocopyExitCode -lt 8  # 0-7 are success/warning, 8+ are errors

    if ($robocopySuccess) {
        Write-Log "Transfer completed successfully (exit code: $robocopyExitCode)" -Color Green
    } else {
        Write-Log "Transfer completed with errors (exit code: $robocopyExitCode)" -Color Red
    }
} else {
    Write-Log "Transfer phase skipped (DoTransfer = $false)" -Color Gray
}

# ============================================================================
# PHASE 5: VERIFICATION
# ============================================================================

Write-Banner "PHASE 5: Verification & Final Report"

Write-Log "Re-scanning directories for verification..." -Color Yellow

# Re-scan source
$sourcePostStats = @()
if (Test-Path $SourceRoot) {
    $sourceFolders = Get-ChildItem -Path $SourceRoot -Directory -Force -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -notmatch '^_' }

    foreach ($folder in $sourceFolders) {
        $size = Get-FolderSize -Path $folder.FullName
        $fileCount = Get-FolderFileCount -Path $folder.FullName

        $sourcePostStats += [PSCustomObject]@{
            Location = "Source"
            FolderName = $folder.Name
            SizeMB = [math]::Round($size / 1MB, 2)
            FileCount = $fileCount
        }
    }
}

# Scan destination
$destStats = @()
if ($DoTransfer -and (Test-Path $DestRoot)) {
    $destFolders = Get-ChildItem -Path $DestRoot -Directory -Force -ErrorAction SilentlyContinue |
        Where-Object { $_.Name -notmatch '^_' }

    foreach ($folder in $destFolders) {
        $size = Get-FolderSize -Path $folder.FullName
        $fileCount = Get-FolderFileCount -Path $folder.FullName

        $destStats += [PSCustomObject]@{
            Location = "Destination"
            FolderName = $folder.Name
            SizeMB = [math]::Round($size / 1MB, 2)
            FileCount = $fileCount
        }
    }
}

# Combine and export
$verificationData = $sourcePostStats + $destStats
$verificationData | Export-Csv -Path $reportFiles.Verification -NoTypeInformation
Write-Log "Saved: $($reportFiles.Verification)" -Color Green

# Calculate final totals
$totalSourcePostSize = ($sourcePostStats | Measure-Object -Property SizeMB -Sum).Sum
$totalSourcePostFiles = ($sourcePostStats | Measure-Object -Property FileCount -Sum).Sum
$totalDestSize = ($destStats | Measure-Object -Property SizeMB -Sum).Sum
$totalDestFiles = ($destStats | Measure-Object -Property FileCount -Sum).Sum

# ============================================================================
# FINAL SUMMARY
# ============================================================================

Write-Banner "EXECUTION SUMMARY"

$summary = @"
Project Optimization Summary
Generated: $(Get-Date)
Mode: $(if($SafetyDryRun){'DRY RUN (No changes made)'}else{'LIVE EXECUTION'})
================================================================================

INITIAL STATE:
  Total folders: $($folderStats.Count)
  Total files: $totalInitialFiles
  Total size: $([math]::Round($totalInitialSize / 1GB, 2)) GB

CLEANUP (Phase 2):
  Directories removed: $($cleanupStats.DirsRemoved)
  Files removed: $($cleanupStats.FilesRemoved)
  Space freed: $([math]::Round($cleanupStats.SpaceFreed / 1GB, 2)) GB

ARCHIVE (Phase 3):
  Projects archived: $($archiveStats.ProjectsArchived)
  Space archived: $([math]::Round($archiveStats.SpaceArchived / 1GB, 2)) GB

TRANSFER (Phase 4):
  Status: $(if($DoTransfer){'Completed'}else{'Skipped'})
  See: $($reportFiles.Transfer)

FINAL STATE:
  Source folders: $($sourcePostStats.Count)
  Source files: $totalSourcePostFiles
  Source size: $([math]::Round($totalSourcePostSize, 2)) MB

  Destination folders: $($destStats.Count)
  Destination files: $totalDestFiles
  Destination size: $([math]::Round($totalDestSize, 2)) MB

ESTIMATED SAVINGS:
  Total space reclaimed: $([math]::Round(($cleanupStats.SpaceFreed + $archiveStats.SpaceArchived) / 1GB, 2)) GB
  Transfer size optimized: $([math]::Round(($totalInitialSize - $totalSourcePostSize * 1MB) / 1GB, 2)) GB

REPORTS GENERATED:
  - Top folders by size: $($reportFiles.TopFolders)
  - File type breakdown: $($reportFiles.FileTypes)
  - Cleanup log: $($reportFiles.Cleanup)
  - Archive log: $($reportFiles.Archive)
  - Transfer log: $($reportFiles.Transfer)
  - Verification: $($reportFiles.Verification)
  - This summary: $($reportFiles.Summary)

================================================================================
"@

Write-Host $summary
$summary | Out-File -FilePath $reportFiles.Summary -Encoding UTF8

if ($SafetyDryRun) {
    Write-Log ""
    Write-Log "DRY RUN COMPLETE - No changes were made to your files" -Color Yellow
    Write-Log "Review the reports above, then run with -SafetyDryRun:`$false to execute" -Color Yellow
} else {
    Write-Log ""
    Write-Log "OPTIMIZATION COMPLETE" -Color Green
    Write-Log "All reports saved to: $ReportDir" -Color Cyan
}

Write-Log ""
Write-Log "Script finished at $(Get-Date)" -Color Cyan
