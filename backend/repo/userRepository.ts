import User from '../model/user';
import fs from 'fs';

const USERS_FILE_PATH = 'users.json';

interface UserData {
  users: User[];
}
  
export class UserRepository {
  private users: User[];

  constructor() {
    this.users = this.loadUsers();
  }

  private loadUsers(): User[] {
    try {
      const data = fs.readFileSync(USERS_FILE_PATH, 'utf-8');
      const userData: UserData = JSON.parse(data);
      return userData.users;
    } catch (error) {
      return [];
    }
  }

  private saveUsers(): void {
    const userData: UserData = { users: this.users };
    fs.writeFileSync(USERS_FILE_PATH, JSON.stringify(userData, null, 2));
  }

  public addUser(user: User): void {
    this.users.push(user);
    this.saveUsers();
  }

  public deleteUser(id: string): void {
    this.users = this.users.filter(user => user.id !== id);
    this.saveUsers();
  }

  public getUsersFromCity(city: string): User[] {
    return this.users.filter(user => user.city === city);
  }

  public rejectUser(current: string, id: string): void {
    const user = this.users.find(user => user.id === current);
    if (user) {
      user.rejected.push(id);
      this.saveUsers();
    }
  }

  public approveUser(current: string, id: string): void {
    const current_user = this.users.find(user => user.id === current);
    const second_user = this.users.find(user => user.id === id);
    if (current_user && second_user) {
      current_user.approved.push(id);
      if (second_user.approved.includes(current)) {
        current_user.matched.push(id);
        second_user.matched.push(current);
      }
      this.saveUsers();
    }
  }
}