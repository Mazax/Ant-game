for %%a in (.) do set currentfolder=%%~na
cd ..
http-server %currentfolder%
PAUSE