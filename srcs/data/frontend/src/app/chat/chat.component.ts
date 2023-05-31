import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from './chat.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { GameService } from '../game/game.service';

export interface IUser {
  id: number;
  username: string;
  email: string;
  avatar: string;
  status: number;
  last_online_date: Date;
}

export class Member {
  constructor(channel_id: number, user_id: number) {
    this.channel_id = channel_id;
    this.user_id = user_id;
    this.user_status = 0;
    this.mute_status = false;
    this.mute_time = 0;
    this.mute_timestamp_day = 0;
    this.mute_timestamp_msec = 0;
    this.ban_status = false;
  }
  member_id!: number;
  channel_id: number;
  user_id: number;
  user_status: number;
  mute_status: boolean;
  mute_time: number;
  mute_timestamp_day: number;
  mute_timestamp_msec: number;
  ban_status: boolean;
}

export class infoMess {
  constructor(message: Message, sender: IUser) {
    this.message = message;
    this.sender = sender;
    if (
      this.message.content.indexOf('/game') == 0 &&
      this.message.content.length == 5
    ) {
      this.gameInvite = true;
    } else {
      this.gameInvite = false;
    }
    if (this.message.content.indexOf('/invite ') == 0) {
      this.invite = true;
      this.chan = this.message.content.substring(8);
    } else {
      this.chan = '';
      this.invite = false;
    }
  }
  message: Message;
  sender: IUser;
  gameInvite: boolean;
  invite: boolean;
  chan: string;
}

export class editStruct {
  constructor(member: Member, user: IUser) {
    this.user = user;
    this.member = member;
  }
  member: Member;
  user: IUser;
}

export class Message {
  constructor(content: string, sender_id: number, channel_id: number) {
    this.content = content;
    this.sender_id = sender_id;
    this.channel_id = channel_id;
  }
  message_id?: number;
  content: string;
  sender_id: number;
  channel_id: number;
}

export class Channel {
  constructor(name: string, mode: number, password: string) {
    this.name = name;
    this.mode = mode;
    this.password = password;
  }
  channel_id!: number;
  name: string;
  mode: number;
  password: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, OnDestroy {
  token!: string | null;
  user: IUser | null = null;
  channelsList: Channel[] = [];
  activeChan: Channel | null = null;
  messages: Message[] = [];
  infos: infoMess[] = [];
  users: IUser[] = [];
  mbrChan: editStruct[] = [];
  timer: any;
  members: Member[] = [];
  joined: boolean = false;
  selectMode: HTMLSelectElement | null = null;
  editSelectMode: HTMLSelectElement | null = null;
  modeStatus: Member | null = null;
  muteTimeChecker: any;

  constructor(
    private chatService: ChatService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.init();
    this.timer = setInterval(() => {
      this.init();
    }, 200);
    this.muteTimeChecker = setInterval(() => {
      this.checkMute();
    }, 500);
  }

  checkMute() {
    this.chatService.getAllMembers().subscribe((data) => {
      if (!data) {
        return;
      }
      const membersList: Member[] = data;
      for (let i = 0; i < membersList.length; i++) {
        if (membersList[i].mute_status) {
          const end = Date.now();
          if (
            membersList[i].mute_time * 1000 <=
            end -
              (membersList[i].mute_timestamp_day * 86400 +
                membersList[i].mute_timestamp_msec)
          ) {
            membersList[i].mute_status = false;
            this.chatService.updateMember(membersList[i]).subscribe();
          }
        }
      }
    });
  }

  kickUser(member: Member) {
    this.chatService.deleteMember(member.member_id).subscribe();
    this.closeEdit();
  }

  banUser(member: Member) {
    member.ban_status = true;
    this.chatService.updateMember(member).subscribe();
  }

  unbanUser(member: Member) {
    member.ban_status = false;
    this.chatService.updateMember(member).subscribe();
  }

  async muteUser(member: Member) {
    const time: number = Number(
      (<HTMLInputElement>document.getElementsByClassName('inputMuteTime')[0])
        .value
    );
    member.mute_status = true;
    member.mute_time = time;
    const timeNow = Date.now();
    member.mute_timestamp_day = Math.floor(timeNow / 86400);
    member.mute_timestamp_msec = timeNow % 86400;
    this.chatService.updateMemberMute(member).subscribe((value) => {});
  }

  promoteUser(member: Member) {
    member.user_status = 1;
    this.chatService.updateMember(member).subscribe();
  }

  unpromoteUser(member: Member) {
    member.user_status = 0;
    this.chatService.updateMember(member).subscribe();
  }

  openDialog() {
    const dialogChan: HTMLDialogElement | null = <HTMLDialogElement>(
      document.getElementsByClassName('dialogChannel')[0]
    );
    if (dialogChan) {
      this.selectMode = <HTMLSelectElement>(
        document.getElementsByClassName('selectMode')[0]
      );
      dialogChan.showModal();
    }
  }

  openHelper() {
    const dialogHelper: HTMLDialogElement | null = <HTMLDialogElement>(
      document.getElementsByClassName('dialogHelper')[0]
    );
    if (dialogHelper) {
      dialogHelper.showModal();
    }
  }

  closeButton() {
    const dialogHelper: HTMLDialogElement | null = <HTMLDialogElement>(
      document.getElementsByClassName('dialogHelper')[0]
    );
    if (dialogHelper) {
      dialogHelper.close();
    }
  }

  openEdit() {
    const dialogEdit: HTMLDialogElement | null = <HTMLDialogElement>(
      document.getElementsByClassName('dialogEdit')[0]
    );
    if (dialogEdit) {
      this.editSelectMode = <HTMLSelectElement>(
        document.getElementsByClassName('editSelectMode')[0]
      );
    }
    dialogEdit.showModal();
  }

  closeEdit() {
    const dialogEdit: HTMLDialogElement | null = <HTMLDialogElement>(
      document.getElementsByClassName('dialogEdit')[0]
    );
    if (dialogEdit) {
      dialogEdit.close();
    }
  }

  cancelButton() {
    const dialogRef: HTMLDialogElement | null = <HTMLDialogElement>(
      document.getElementsByClassName('dialogChannel')[0]
    );
    if (dialogRef) {
      dialogRef.close();
    }
  }

  askPassword() {
    const dialogPass: HTMLDialogElement | null = <HTMLDialogElement>(
      document.getElementsByClassName('dialogPass')[0]
    );
    if (dialogPass) {
      dialogPass.showModal();
    }
  }

  closePass() {
    const dialogPass: HTMLDialogElement | null = <HTMLDialogElement>(
      document.getElementsByClassName('dialogPass')[0]
    );
    if (dialogPass) {
      dialogPass.close();
    }
  }

  async submitPass() {
    const pass = (<HTMLInputElement>(
      document.getElementsByClassName('passInput')[0]
    )).value;
    this.chatService
      .checkPass(pass, this.activeChan!.channel_id)
      .subscribe((data) => {
        const ret = data;
        if (ret) {
          let member: Member = new Member(
            this.activeChan!.channel_id,
            this.user!.id
          );
          member.user_status = 0;
          this.chatService.addMember(member).subscribe(() => {
            window.location.reload();
          });
        }
      });
  }

  async submitChan() {
    let pass = '';
    const name: string | null = (<HTMLInputElement>(
      document.getElementsByClassName('nameInput')[0]
    )).value;
    const mode: string = this.selectMode!.value;
    this.chatService.checkChan(name, mode).subscribe((value: boolean) => {
      if (!value) {
        return;
      }
      this.chatService.checkChanExist(name).subscribe((value: boolean) => {
        if (!value) {
          return;
        }
        if (this.selectMode!.value == 'protected') {
          pass = (<HTMLInputElement>(
            document.getElementsByClassName('passwordInput')[0]
          )).value;
        }
        this.chatService
          .checkPassFormat(mode, pass)
          .subscribe((value: boolean) => {
            if (!value) {
              return;
            }
            const modeNumber = mode == 'public' ? 0 : mode == 'private' ? 2 : 1;
            let channel: Channel = new Channel(name, modeNumber, pass);
            const dialogRef: HTMLDialogElement | null = <HTMLDialogElement>(
              document.getElementsByClassName('dialogChannel')[0]
            );
            if (dialogRef) {
              dialogRef.close();
            }
            this.chatService.addChannel(channel).subscribe(async () => {
              setTimeout(async () => {
                let tmp = await this.chatService.getChannelByName(channel.name);
                tmp.subscribe((data: any) => {
                  if (!data) {
                    return;
                  }
                  const chan = data;
                  let member: Member = new Member(
                    chan.channel_id,
                    this.user!.id
                  );
                  member.user_status = 2;
                  this.chatService.addMember(member).subscribe();
                });
              }, 3000);
            });
          });
      });
    });
  }

  async submitEdit() {
    let pass = '';
    const name: string | null = (<HTMLInputElement>(
      document.getElementsByClassName('editNameInput')[0]
    )).value;
    const mode: string = this.editSelectMode!.value;
    this.chatService.checkChan(name, mode).subscribe((value: boolean) => {
      if (!value) {
        return;
      }
      this.chatService.checkChanExist(name).subscribe((value: boolean) => {
        if (!value) {
          return;
        }
        if (this.editSelectMode!.value == 'protected') {
          pass = (<HTMLInputElement>(
            document.getElementsByClassName('editPasswordInput')[0]
          )).value;
        }
        this.chatService
          .checkPassFormat(mode, pass)
          .subscribe((value: boolean) => {
            if (!value) {
              return;
            }
            const modeNumber = mode == 'public' ? 0 : mode == 'private' ? 2 : 1;
            this.activeChan!.name = name;
            this.activeChan!.mode = modeNumber;
            this.activeChan!.password = pass;
            const dialogRef: HTMLDialogElement | null = <HTMLDialogElement>(
              document.getElementsByClassName('dialogEdit')[0]
            );
            if (dialogRef) {
              dialogRef.close();
            }
            this.chatService.updateChannel(this.activeChan!).subscribe();
          });
      });
    });
  }

  async channelAcceptInvite(channel_name: string) {
    (await this.chatService.getChannelByName(channel_name)).subscribe(
      (data: any) => {
        if (!data) {
          return;
        }
        let chan = data;
        this.chatService.getMembers(this.user!.id).subscribe((data) => {
          if (!data) {
            return;
          }
          let mem = data;
          for (let i = 0; i < mem.length; i++) {
            if (
              mem[i].user_id == this.user!.id &&
              mem[i].channel_id == chan.channel_id
            ) {
              return;
            }
          }
          let member: Member = new Member(chan.channel_id, this.user!.id);
          this.chatService.addMember(member).subscribe();
        });
      }
    );
  }

  joinGame(player1_id: number) {
    this.gameService.acceptPrivateGame(player1_id).subscribe();
    this.router.navigate(['/play']);
  }

  async onSubmit() {
    const mess: string | null = (<HTMLInputElement>(
      document.getElementById('messageInput')
    )).value;
    this.chatService.checkMess(mess).subscribe(async (value: boolean) => {
      if (value) {
        let message: Message = new Message(
          mess,
          this.user!.id,
          this.activeChan!.channel_id
        );
        (<HTMLInputElement>document.getElementById('messageInput')).value = '';
        if (
          message.content.indexOf('/game') == 0 &&
          message.content.length == 5
        ) {
          this.gameService.createPrivateGame().subscribe();
          this.router.navigate(['/play']);
        }
        if (message.content.indexOf('/invite ') == 0) {
          let name = message.content.substring(8);
          if (name == '') {
            return;
          }
          let test = await this.chatService.getChannelByName(name);
          await test.subscribe((data: any) => {
            if (!data) {
              return;
            }
            let chan = data;
            if (chan.mode != 2) {
              return;
            }
            this.chatService.getMembers(this.user!.id).subscribe((data) => {
              if (!data) {
                return;
              }
              let members = data;
              for (let i = 0; i < members.length; i++) {
                if (chan.channel_id == members[i].channel_id) {
                  this.chatService.addMessage(message).subscribe();
                  return;
                }
              }
              return;
            });
          });
        } else {
          this.chatService.addMessage(message).subscribe();
        }
      }
    });
  }

  init() {
    if (this.router.url.includes('chat/')) {
      const id_chan: number =
        +this.activatedRoute.snapshot.params['activeChan'];
      this.chatService.getChannel(id_chan).subscribe((data) => {
        if (!data) return;
        this.activeChan = data;
        this.token = localStorage.getItem('JWT');
        if (!this.token) {
          return;
        }
        this.chatService.getUser().subscribe((data) => {
          if (!data) {
            return;
          }
          this.user = data;
        });
        this.chatService.getChannels().subscribe((data) => {
          if (!data) return;
          let chanList = data;
          this.chatService.getUsers().subscribe((data) => {
            if (!data) {
              return;
            }
            this.users = data;
            if (this.activeChan) {
              this.chatService.getMembers(this.user!.id).subscribe((data) => {
                this.members = data;
                for (let j = 0; j < this.members.length; j++) {
                  if (
                    this.members[j].channel_id == this.activeChan!.channel_id &&
                    this.user!.id == this.members[j].user_id
                  ) {
                    this.modeStatus = this.members[j];
                    break;
                  }
                }
                if (this.modeStatus && this.modeStatus.user_status != 0) {
                  this.chatService
                    .getMembersChannel(this.activeChan!.channel_id)
                    .subscribe((data) => {
                      if (data) {
                        const mbrChanTmp: Member[] = data;
                        let arrUser: editStruct[] = [];
                        for (let i = 0; i < mbrChanTmp.length; i++) {
                          if (this.user!.id == mbrChanTmp[i].user_id) {
                            continue;
                          }
                          for (let j = 0; j < this.users.length; j++) {
                            if (
                              this.users[j].id == mbrChanTmp[i].user_id &&
                              mbrChanTmp[i].user_status != 2
                            ) {
                              arrUser.push(
                                new editStruct(mbrChanTmp[i], this.users[j])
                              );
                              break;
                            }
                          }
                        }
                        this.mbrChan = arrUser;
                      }
                    });
                }
                for (let j = 0; j < chanList.length; ++j) {
                  let exist: boolean = false;
                  if (chanList[j].mode == 0 || chanList[j].mode == 1) {
                    continue;
                  }
                  for (let i = 0; i < this.members.length; ++i) {
                    if (
                      this.user!.id == this.members[i].user_id &&
                      this.members[i].channel_id == chanList[j].channel_id &&
                      this.members[i].ban_status == true
                    ) {
                      chanList.splice(j, 1);
                      --j;
                      exist = true;
                      break;
                    }
                    if (chanList[j].channel_id == this.members[i].channel_id) {
                      exist = true;
                      break;
                    }
                  }
                  if (exist == false) {
                    chanList.splice(j, 1);
                    --j;
                  }
                }
                let isMember = false;
                for (let j = 0; j < chanList.length; j++) {
                  if (this.activeChan!.channel_id == chanList[j].channel_id) {
                    isMember = true;
                    break;
                  }
                }
                if (!isMember) {
                  this.router.navigateByUrl('/chat');
                }
                for (let j = 0; j < chanList.length; j++) {
                  if (chanList[j].mode == 3) {
                    chanList.splice(j, 1);
                    --j;
                  }
                }
                this.channelsList = chanList;
                for (let i = 0; i < this.members.length; ++i) {
                  if (
                    this.members[i].channel_id === this.activeChan!.channel_id
                  ) {
                    this.joined = true;
                    break;
                  }
                }
                this.chatService
                  .getMessages(this.activeChan?.channel_id)
                  .subscribe((data: any) => {
                    let infs: infoMess[] = [];
                    if (!data) {
                      return;
                    }
                    this.messages = data;
                    this.chatService
                      .getBlocked(this.user!.id)
                      .subscribe((data) => {
                        let blocked = data;
                        for (let k = 0; k < this.messages.length; k++) {
                          let tmp = this.findUser(this.messages[k].sender_id);
                          if (tmp) {
                            if (blocked) {
                              for (let j = 0; j < blocked.length; j++) {
                                if (
                                  blocked[j].user2_id ==
                                  this.messages[k].sender_id
                                ) {
                                  this.messages[k].content = 'Blocked User';
                                  break;
                                }
                              }
                            }
                            infs.push(new infoMess(this.messages[k], tmp));
                          }
                        }
                        infs.reverse();
                        this.infos = infs;
                      });
                  });
              });
            }
          });
        });
      });
    } else {
      this.token = localStorage.getItem('JWT');
      if (!this.token) {
        return;
      }
      this.chatService.getUser().subscribe((data) => {
        if (!data) {
          return;
        }
        this.user = data;
      });
      this.chatService.getChannels().subscribe((data) => {
        if (!data) {
          return;
        }
        let chanList = data;
        this.chatService.getUsers().subscribe((data) => {
          if (!data) {
            return;
          }
          this.users = data;
          this.chatService.getMembers(this.user!.id).subscribe((data) => {
            this.members = data;
            for (let j = 0; j < chanList.length; j++) {
              let exist: boolean = false;
              if (chanList[j].mode == 0 || chanList[j].mode == 1) {
                continue;
              }
              for (let i = 0; i < this.members.length; i++) {
                if (
                  this.user!.id == this.members[i].user_id &&
                  this.members[i].channel_id == chanList[j].channel_id &&
                  this.members[i].ban_status == true
                ) {
                  chanList.splice(j, 1);
                  --j;
                  exist = true;
                  break;
                }
                if (chanList[j].channel_id == this.members[i].channel_id) {
                  exist = true;
                  break;
                }
              }
              if (exist == false) {
                chanList.splice(j, 1);
                --j;
              }
            }
            for (let j = 0; j < chanList.length; j++) {
              if (chanList[j].mode == 3) {
                chanList.splice(j, 1);
                --j;
              }
            }
            this.channelsList = chanList;
          });
        });
      });
    }
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.timer) clearInterval(this.muteTimeChecker);
  }

  channelJoin() {
    let member: Member = new Member(this.activeChan!.channel_id, this.user!.id);
    this.chatService.addMember(member).subscribe();
  }

  channelQuit() {
    this.chatService
      .getMember(this.activeChan!.channel_id, this.user!.id)
      .subscribe((data) => {
        if (!data) {
          return;
        }
        let member: Member = data;
        this.chatService.deleteMember(member.member_id).subscribe();
        this.joined = false;
        this.init();
      });
  }

  findUser(sender_id: number) {
    let user: IUser | null = null;
    this.users.forEach((data) => {
      if (data.id == sender_id) {
        user = data;
      }
    });
    return user;
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
