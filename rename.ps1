# Company name
$oldCompanyName="YourCompanyName"
$newCompanyName="YourCompanyName"

# Project name
$oldProjectName="Cool42Template" 
$newProjectName="Cool42Template"
 
# folders to deal with
$targetFolder = (Get-Item -Path "." -Verbose).FullName 

function Rename {
	param (
		$TargetFolder,
		$PlaceHolderCompanyName,
		$PlaceHolderProjectName,
		$NewCompanyName,
		$NewProjectName
	)
	# Config
	$fileType="FileInfo"  
	$dirType="DirectoryInfo"  
	$include=@("*.cs","*.cshtml","*.asax","*.ps1","*.ts","*.csproj","*.sln","*.xaml","*.json","*.js","*.xml","*.config","Dockerfile")

	$elapsed = [System.Diagnostics.Stopwatch]::StartNew()

	Write-Host ''
	Write-Host '----------------------------------------------------------------------------------'
	Write-Host "[$TargetFolder] Renaming folders ..."
	Write-Host '----------------------------------------------------------------------------------'
	# Rename folders
	Ls $TargetFolder -Recurse | Where { $_.GetType().Name -eq $dirType -and ($_.Name.Contains($PlaceHolderCompanyName) -or $_.Name.Contains($PlaceHolderProjectName)) } | ForEach-Object{
		Write-Host '-(dir. name) ' $_.FullName
		$newDirectoryName=$_.Name.Replace($PlaceHolderCompanyName,$NewCompanyName).Replace($PlaceHolderProjectName,$NewProjectName)
		Rename-Item $_.FullName $newDirectoryName
	} 
	Write-Host '----------------------------------------------------------------------------------'
	Write-Host '' 

	# Replace file contents and rename file 
	Write-Host '----------------------------------------------------------------------------------'
	Write-Host "[$TargetFolder] Renaming file contents and file names ..."
	Write-Host '----------------------------------------------------------------------------------'
	Ls $TargetFolder -Include $include -Recurse | Where { $_.GetType().Name -eq $fileType} | ForEach-Object{
		$fileText = Get-Content $_ -Raw -Encoding UTF8
		if($fileText.Length -gt 0 -and ($fileText.contains($PlaceHolderCompanyName) -or $fileText.contains($PlaceHolderProjectName))){
			$fileText.Replace($PlaceHolderCompanyName,$NewCompanyName).Replace($PlaceHolderProjectName,$NewProjectName) | Set-Content $_ -Encoding UTF8
			Write-Host '-(text) ' $_.FullName
		}
		If($_.Name.contains($PlaceHolderCompanyName) -or $_.Name.contains($PlaceHolderProjectName)){
			$newFileName=$_.Name.Replace($PlaceHolderCompanyName,$NewCompanyName).Replace($PlaceHolderProjectName,$NewProjectName)
			Rename-Item $_.FullName $newFileName
			Write-Host '-(name) ' $_.FullName
		}
	} 
	Write-Host '----------------------------------------------------------------------------------'
	Write-Host ''

	$elapsed.stop()
	Write-Host '----------------------------------------------------------------------------------'
	write-host "[$TargetFolder] Total time: $($elapsed.Elapsed.ToString())"
	Write-Host '----------------------------------------------------------------------------------'
	Write-Host ''
}
Rename -TargetFolder $targetFolder -PlaceHolderCompanyName $oldCompanyName -PlaceHolderProjectName $oldProjectName -NewCompanyName $newCompanyName -NewProjectName $newProjectName














