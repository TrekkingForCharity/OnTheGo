#addin "Cake.Npm"
#tool "nuget:?package=GitVersion.CommandLine"
var target = Argument<string>("target", "Default");

GitVersion gitversion;
Task("__Clean")
    .Does(() => {
        CleanDirectories(new DirectoryPath[] {
            "./.cache",
            "./.nyc_output",
            "./coverage",
            "./dist"
        });
    });

Task("__Versioning")
    .Does(() => {
        gitversion = GitVersion();        
        TFBuild.Commands.UpdateBuildNumber(gitversion.FullSemVer);
    });

Task("__Install")
    .Does(() => {
        NpmInstall();
        NpmRunScript("font:install");
    });

Task("__Build")
    .Does(() => {
        NpmRunScript("build:main");
        NpmRunScript("build:partial");
    });

Task("__Test")
    .Does(() => {
        NpmRunScript("test:coverage");
    });

Task("Build")
    .IsDependentOn("__Clean")
    .IsDependentOn("__Versioning")
    .IsDependentOn("__Install")
    .IsDependentOn("__Build")
    .IsDependentOn("__Test")
    ;

Task("Default")
    .IsDependentOn("Build");

RunTarget(target);