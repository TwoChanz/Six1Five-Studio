# Transfer RealityCapturePortfolio to E:\LiveProjects
& "$PSScriptRoot\optimize-projects.ps1" `
    -SafetyDryRun:$false `
    -SourceRoot "C:\Users\Overlord\LiveProjects\RealityCapturePortfolio" `
    -DestRoot "E:\LiveProjects\RealityCapturePortfolio" `
    -ArchiveRoot "E:\ArchivedProjects" `
    -ReportDir "C:\Users\Overlord\LiveProjects\RealityCapturePortfolio\_transfer_reports" `
    -AgeDaysForArchive 45
