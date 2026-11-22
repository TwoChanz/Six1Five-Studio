# Wrapper script to execute optimize-projects.ps1 in LIVE mode
& "$PSScriptRoot\optimize-projects.ps1" `
    -SafetyDryRun:$false `
    -SourceRoot "C:\Projects" `
    -DestRoot "E:\LiveProjects" `
    -ArchiveRoot "E:\ArchivedProjects" `
    -ReportDir "C:\Projects\_transfer_reports" `
    -AgeDaysForArchive 45
