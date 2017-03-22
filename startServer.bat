for %%a in (.) do set currentfolder=%%~na
http-server %currentfolder%
PAUSE