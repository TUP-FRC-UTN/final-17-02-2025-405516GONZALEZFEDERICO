import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Word, Score } from '../../interfaces/interface-final';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private readonly WORDS_API = 'https://671fe287e7a5792f052fdf93.mockapi.io/words';
  private readonly SCORES_API = 'https://671fe287e7a5792f052fdf93.mockapi.io/scores';

  constructor(private http: HttpClient) {}

  getWords(): Observable<Word[]> {
    return this.http.get<Word[]>(this.WORDS_API)
      .pipe(
        catchError(error => {
          console.error('Error al obtener las palabras:', error);
          return of([]);
        })
      );
  }

  getScores(): Observable<Score[]> {
    return this.http.get<Score[]>(this.SCORES_API)
      .pipe(
        catchError(error => {
          console.error('Error al obtener los puntajes:', error);
          return of([]);
        })
      );
  }

  getUserScores(playerName: string): Observable<Score[]> {
    return this.http.get<Score[]>(this.SCORES_API)
      .pipe(
        catchError(error => {
          console.error('Error obteniendo los puntos del usuario:', error);
          return of([]);
        })
      );
  }

  saveScore(score: Omit<Score, 'id'>): Observable<Score> {
    return this.http.post<Score>(this.SCORES_API, score)
      .pipe(
        catchError(error => {
          console.error('Error al guardar los puntos :', error);
          return of({} as Score);
        })
      );
  }

  calculateScore(attemptsLeft: number): number {
    const scoreMap: { [key: number]: number } = {
      6: 100,
      5: 80,
      4: 60,
      3: 40,
      2: 20,
      1: 10,
      0: 0
    };
    return scoreMap[attemptsLeft] || 0;
  }

  generateGameId(playerName: string, gamesPlayed: number): string {
    const initials = playerName
      .split(' ')
      .map(name => name[0])
      .join('');
    return `P${gamesPlayed}${initials}`;
  }
  
}
