# promoserver
# 介绍 #
这是为Business Service TOKEN Package提供的API服务。目前只有ICO阶段

# 环境 #
  * go-ethereum 1.7+ stable
  * PostgreSQL 9.6+
  * redis 3.2.8+
  * node 6.11+
  * npm 3.10.10+

# 代码结构 #
  * api/ 代码目录
    * controller 接口控制器
    * domain 数据映射：redis，postgres
    * model 业务实现
  * node_modules/ 工具包目录
  * app.js 接口映射
  * package.json 
  * api.define.json 接口说明

# 接口说明 #
参考文件 api.define.json
  * post: /promo/token  oauth2相关 password，access\_token, refresh\_tokne
  * get: /promo/authed/account/ico/process ico进度
  * post: /promo/public/account 创建account {account,email,password}
  * post: /promo/public/fund/listen 接受监听 { bankType, data }

# 环境初始化 #
这里认为环境已经安装好

## 数据库 ##
  * createuser -P promoserver -U postgres
  * createdb -O promoserver promoserver -U postgres
  
