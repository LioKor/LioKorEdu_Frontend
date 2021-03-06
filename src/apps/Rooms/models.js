import { stripTags } from '/src/utils/utils'

export class Message {
    constructor(username, content, avatarUrl) {
        this.avatarUrl = avatarUrl;
        this.username = username;
        this.content = stripTags(content)
          .replaceAll('\n', '<br />');
        this.content = this.content.replace(
          /((?:https:\/\/)?code\.liokor\.com(\/task\/[^ \n\t]+))/gm,
          `<a href="$2">$1</a>`
        );
        this.date = new Date();
    }
}

export class User {
    constructor(id, username, fullname, avatarUrl) {
        this.id = id;
        this.username = username;
        this.fullname = fullname;
        this.avatarUrl = avatarUrl;

        this.stream = null;
        this.pc = null;
        this.dc = null;
    }
}

export class Room {
    constructor(id, name, owner, maxUsers, hasPassword, host, users) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.maxUsers = maxUsers;
        this.hasPassword = hasPassword;
        this.host = host;

        this.users = users;
    }

    addUser(user) {
        this.users.push(user);
    }

    deleteUser(id) {
        for (let i = 0; i < this.users.length; i++) {
            const user = this.users[i];

            if (user.id === id) {
                this.users.splice(i, 1);
                return;
            }
        }
    }
}
