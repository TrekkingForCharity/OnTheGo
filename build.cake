var target = Argument<string>("target", "Default");

Task("Build")
    ;

Task("Default")
    .IsDependentOn("Build");

RunTarget(target);