import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommentInterface, UserInterface } from '../types/comments.model';

@Injectable()
export class CommentsService {
  constructor(private httpClient: HttpClient) {}

  getCurrentUser(): Observable<UserInterface> {
    return this.httpClient.get<UserInterface>(
      'http://localhost:3000/currentUser'
    );
  }

  getComments(): Observable<CommentInterface[]> {
    return this.httpClient.get<CommentInterface[]>(
      'http://localhost:3000/comments'
    );
  }

  createNewComment(
    content: string,
    user: UserInterface | undefined
  ): Observable<CommentInterface> {
    return this.httpClient.post<CommentInterface>(
      'http://localhost:3000/comments',
      {
        content: content,
        createdAt: new Date(),
        score: 0,
        user: user,
        replies: [],
      }
    );
  }

  editComment(
    content: string,
    commentId: number | undefined
  ): Observable<CommentInterface> {
    return this.httpClient.patch<CommentInterface>(
      `http://localhost:3000/comments/${commentId}`,
      {
        content: content,
      }
    );
  }

  removeComment(commentId: number): Observable<{}> {
    return this.httpClient.delete(
      `http://localhost:3000/comments/${commentId}`
    );
  }

  replies(
    content: string,
    commentId: number | undefined,
    replyingTo: string | undefined,
    comment: CommentInterface | undefined,
    user: UserInterface | undefined
  ) {
    comment?.replies.push({
      content: content,
      replyingTo: replyingTo,
      createdAt: new Date().toISOString(),
      score: 0,
      user: user,
      id: Number(comment.replies.pop()?.id) + 1,
    });

    return this.httpClient.patch<CommentInterface>(
      `http://localhost:3000/comments/${commentId}`,
      comment
    );
  }

  increaseScore(score: number | undefined, commentId: number | undefined): Observable<CommentInterface>{
    return this.httpClient.patch<CommentInterface>(`http://localhost:3000/comments/${commentId}`, {
      score: Number(score) + 1
    })
  }

  decreaseScore(score: number | undefined, commentId: number | undefined): Observable<CommentInterface>{
    return this.httpClient.patch<CommentInterface>(`http://localhost:3000/comments/${commentId}`, {
      score: Number(score) -1
    })
  }
  
}