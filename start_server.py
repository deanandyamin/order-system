import subprocess
import webbrowser
import time

# 使用 cmd 開啟新視窗，切換到指定資料夾，並執行 node server.js
subprocess.Popen(
    'start cmd /k "cd /d C:\\Users\\user\\Desktop\\order-system && node server.js"',
    shell=True
)

# 暫停幾秒，等待 server 啟動（若需要可調整等待時間）
time.sleep(2)

# 分別開啟兩個網址
webbrowser.open("http://192.168.0.4:3000/index.html")
webbrowser.open("http://192.168.0.4:3000/orders.html")
