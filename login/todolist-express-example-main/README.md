# todolist-express-example
* express
* express-session
* express-mysql-session
* sequelize-cli
* sequelize
* mysql2
* cors


Change config/config.json file.

----
### User
1. GET /user
- Login 여부

2. POST /user/login
- {id: ID, pw: PW}
- Login 여부 및 유저 정보

3. POST /user/signup
- {id: ID, pw: PW}
- 회원가입

4. GET /user/logout
- Logout

----
### Todolist
** NEED TO LOGIN **


1. GET /todolist
- Get todolist for current user

2. POST /todolist/create
- {name: TODO ITEM}
- 현재 유저의 TODO 생성

3. POST /todolist/update
- {todo_id: TODO ITEM ID, is_checked: True / False}
- 완료 여부 체크

4. POST /todolist/delete
- {todo_id: TODO ITEM ID}
- Todo Item 삭제
