import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
} from 'date-fns';
import {
  ActiveFormInterface,
  ButtonActionEnum,
  CommentInterface,
  FormStateEnum,
  RepliesInterface,
  SubmitStateEnum,
  UserInterface,
} from '../../types/comments.model';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
})
export class CommentComponent implements OnInit {
  @Input() comment!: CommentInterface;
  @Input() reply: RepliesInterface | undefined;
  @Input() currentUserName: string | undefined;
  @Input() currentUser: UserInterface | undefined;
  @Input() submitState = SubmitStateEnum;
  @Input() initialContent: string = '';
  @Input() activeForm!: ActiveFormInterface | null;

  @Output() updateComment = new EventEmitter<{
    commentContent: string;
    commentId: number | undefined;
  }>();
  @Output() deleteComment = new EventEmitter<number>();
  @Output() addNewReply = new EventEmitter<{
    commentContent: string;
    commentId: number | undefined;
    replyingTo: string | undefined;
    comment: CommentInterface | undefined;
    // user: UserInterface | undefined;
  }>();
  @Output() activatingForm = new EventEmitter<ActiveFormInterface>();
  @Output() increaseScore = new EventEmitter<{
    score: number | undefined;
    commentId: number | undefined;
  }>();
  @Output() decreaseScore = new EventEmitter<{
    score: number | undefined;
    commentId: number | undefined;
  }>();

  buttonAction = ButtonActionEnum;
  canReply: boolean = false;
  canEdit: boolean = false;
  canDelete: boolean = false;
  formState = FormStateEnum;

  constructor() {}

  // canActions() {
  //   this.canReply = this.comment?.user?.username !== this.currentUser?.username;
  //   this.canEdit = this.comment?.user?.username === this.currentUser?.username;
  //   this.canDelete =
  //     this.comment?.user?.username === this.currentUser?.username;
  // }

  replying(): boolean {
    if (!this.activeForm) {
      return false;
    }
    return (
      this.activeForm.id === this.comment?.id &&
      this.activeForm.state === this.formState.replying
    );
  }

  editing(): boolean {
    if (!this.activeForm) {
      return false;
    }
    return (
      this.activeForm.id === this.comment?.id &&
      this.activeForm.state === this.formState.editing
    );
  }

  timeAgo(): string {
    const differeneceInSeconds = differenceInSeconds(
      new Date(),
      new Date(this.comment?.createdAt)
    );
    const differeneceInMinutes = differenceInMinutes(
      new Date(),
      new Date(this.comment?.createdAt)
    );
    const differeneceInHours = differenceInHours(
      new Date(),
      new Date(this.comment?.createdAt)
    );
    const differeneceInDays = differenceInDays(
      new Date(),
      new Date(this.comment?.createdAt)
    );
    const differeneceInWeeks = differenceInWeeks(
      new Date(),
      new Date(this.comment?.createdAt)
    );
    const differeneceInMonts = differenceInMonths(
      new Date(),
      new Date(this.comment?.createdAt)
    );
    const differeneceInYears = differenceInYears(
      new Date(),
      new Date(this.comment?.createdAt)
    );

    if (differeneceInMonts >= 12) {
      return differeneceInYears < 2
        ? `year ago`
        : `${differeneceInYears} years ago`;
    }
    if (differeneceInWeeks >= 4) {
      return differeneceInMonts < 2
        ? `month ago`
        : `${differeneceInMonts} months ago`;
    }
    if (differeneceInDays >= 7) {
      return differeneceInWeeks < 2
        ? `week ago`
        : `${differeneceInWeeks} weeks ago`;
    }
    if (differeneceInHours >= 24) {
      return differeneceInDays < 2
        ? `day ago`
        : `${differeneceInDays} days ago`;
    }
    if (differeneceInMinutes >= 60) {
      return differeneceInHours < 2
        ? `hour ago`
        : `${differeneceInHours} hours ago`;
    }
    if (differeneceInSeconds >= 60) {
      return differeneceInMinutes < 2
        ? `minute ago`
        : `${differeneceInMinutes} minutes ago`;
    }
    if (differeneceInSeconds < 60) {
      return `just now`;
    }

    return this.comment?.createdAt;
  }

  ngOnInit(): void {
    // this.canActions();
    this.canReply = this.comment?.user?.username !== this.currentUser?.username;
    this.canEdit = this.comment?.user?.username === this.currentUser?.username;
    this.canDelete =
      this.comment?.user?.username === this.currentUser?.username;
    this.timeAgo();
  }
}
