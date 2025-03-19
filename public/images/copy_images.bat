@echo off
for /L %%i in (2,1,50) do (
    copy food1.jpg food%%i.jpg
)
echo 完成！
pause
