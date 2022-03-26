import { Component, Input, OnInit } from '@angular/core';
import { CommentsService } from '../../services/comments.service';
import {
  ActiveFormInterface,
  CommentInterface,
  SubmitStateEnum,
  UserInterface,
} from '../../types/comments.model';

@Component({
  selector: 'app-all-comments',
  templateUrl: './all-comments.component.html',
  styleUrls: ['./all-comments.component.scss'],
})
export class AllCommentsComponent implements OnInit {
  @Input() currentUserName: string | undefined;
  @Input() currentUser: UserInterface | undefined;

  commentsData: CommentInterface[] = [];
  initialContent: string = '';
  submitState = SubmitStateEnum;
  activeForm: ActiveFormInterface | null = null;

  constructor(private commmentsService: CommentsService) {}

  currentUserInfo(): void {
    this.commmentsService.getCurrentUser().subscribe((info) => {
      this.currentUser = info;
      console.log(this.currentUser);
    });
  }

  getComments(): void {
    this.commmentsService
      .getComments()
      .subscribe((comments) => (this.commentsData = comments).sort((a, b) => b.score - a.score));
  }

  addNewComment({
    content,
    user,
  }: {
    content: string;
    user: UserInterface | undefined;
  }) {
    this.commmentsService
      .createNewComment(content, user)
      .subscribe((comment) => {
        this.commentsData = [...this.commentsData, comment];
        console.log(this.commentsData);
      });
  }

  updateComment({
    commentContent,
    commentId,
  }: {
    commentContent: string;
    commentId: number | undefined;
  }) {
    this.commmentsService
      .editComment(commentContent, commentId)
      .subscribe((editedComment) => {
        this.commentsData = this.commentsData.map((element) => {
          if (element.id === commentId) {
            return editedComment;
          }
          return element;
        });
      });
    this.activeForm = null;
  }

  deleteCommment(commentId: number) {
    this.commmentsService.removeComment(commentId).subscribe(() => {
      this.commentsData = this.commentsData.filter(
        (element) => element.id !== commentId
      );
    });
  }

  addNewReply({
    commentContent,
    commentId,
    replyingTo,
    comment
  }: {
    commentContent: string;
    commentId: number | undefined;
    replyingTo: string | undefined;
    comment: CommentInterface | undefined
  }) {
    this.commmentsService.replies(commentContent, commentId, replyingTo, comment, this.currentUser).subscribe(comments => {
      console.log(comments);
    })
    this.activeForm = null;
  }

  increaseScore({score, commentId}: {score: number | undefined, commentId: number | undefined}) {
    this.commmentsService.increaseScore(score, commentId).subscribe(comment => {
      this.commentsData = this.commentsData.map(element => {
        if (element.id === commentId ) {
          return comment;
        }
        return element;
      }).sort((a, b) => b.score - a.score);
    })
  }

  decreaseScore({score, commentId}: {score: number | undefined, commentId: number | undefined}) {
    this.commmentsService.decreaseScore(score, commentId).subscribe(comment => {
      this.commentsData = this.commentsData.map(element => {
        if (element.id === commentId ) {
          return comment;
        }
        return element;
      }).sort((a, b) => b.score - a.score);
    })
  }

  activatingForm(activating: ActiveFormInterface): void {
    this.activeForm = activating;
  }

  ngOnInit(): void {
    this.currentUserInfo();
    this.getComments();
  }
}