# Gloria Borger :woman_technologist:

> A GitHub App built with [Probot](https://github.com/probot/probot) that helps to collaborate and automate sending emails and tweets through GitHub repo


## Setup
- Clone the repo into your local machine
- Copy the `.env.example` in the project directory to `.env` and update the values
- Install all the dependencies `npm install`
- Start the Bot `npm start`
- If you are running for the first time, make sure to visit the localhost webpage run by the app and install it in your repositories

### Repository setup 
For Gloria Borger to work on your repository, make sure the repository has a `news-room.yml` file inside `.github` folder in your project.
- create the `news-room.yml` file inside `.github` sub directory
- copy the following contents into the file
```
email_recipients:
  group_name_1:
    - email1@example.com
    - email2@example.com
  group_name_2:
    - email3@example.com
    - email4@example.com
admins:
  - adminUsername1
  - adminUsername2
```
change the group_name.. to your desired group name and add valid email addressess under them, this group name will be used to send mails. Add the usernames of all the admins who will be able to use the bot in the repository.

### Usage

Comment the following commands in any Issue or PullRequest to mail the body of the issue/pull request to the specified email

#### All the Issue/PR should have an approved label before sending mails

#### 1. Approving the ISSUE/PR
```
/approve
```
![Screenshot_2019-04-18 so-sc news-room](https://user-images.githubusercontent.com/18684321/56336491-47ee7080-61be-11e9-8657-f44f7b55ea48.png)

#### 2. Sending mail to an email group
Make sure the email group is defined inside the `news-room.yml` file under `email_recipients`
```
/mail to [EMAIL_GROUP_NAME]
```
![Screenshot_2019-04-18 so-sc news-room(1)](https://user-images.githubusercontent.com/18684321/56336515-68b6c600-61be-11e9-8718-af3876af0239.png)

#### 3. Sending mail to a specified email
Gloria Borger will automatically delete the comment containing the email for privacy concerns
```
/mail to example@email.com
```

![Screenshot_2019-04-18 so-sc news-room(2)](https://user-images.githubusercontent.com/18684321/56336553-91d75680-61be-11e9-9f6f-06139eda0fdc.png)

## Contributing

If you have suggestions for how gloria-borger could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2019 [Musthaq Ahamad](https://github.com/haxzie) 
