import { Component, inject, OnInit } from '@angular/core';
import { GameService } from '../../services/game/game.service';
import { ServiceFinalService } from '../../services/login/service-final.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  private gameService = inject(GameService);
  private userService = inject(ServiceFinalService);
  private sanitizer = inject(DomSanitizer);

  safeHangmanSvg: SafeHtml = '';
  gameOver: boolean = false;
  gameWon: boolean = false;
  currentWord: string = '';
  displayWord: string = '';
  attemptsLeft: number = 6;
  usedLetters: string[] = [];
  wrongLetters: string[] = [];

  keyboard: string[][] = [
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
    ['K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S'],
    ['T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  ];

  ngOnInit() {
    this.initializeGame();
  }

  private initializeGame() {
    this.gameService.getWords().subscribe(words => {
      const randomWord = words[Math.floor(Math.random() * words.length)];
      this.currentWord = randomWord.word.toUpperCase();
      this.displayWord = '_ '.repeat(this.currentWord.length);
      this.attemptsLeft = 6;
      this.usedLetters = [];
      this.wrongLetters = [];
      this.gameOver = false;
      this.gameWon = false;
      this.updateHangmanDrawing();
    });
  }

  private updateHangmanDrawing() {
    const baseStructure = `
      <svg width="200" height="300" xmlns="http://www.w3.org/2000/svg">
        <line x1="50" y1="280" x2="150" y2="280" stroke="black" stroke-width="2"/>
        <line x1="100" y1="280" x2="100" y2="50" stroke="black" stroke-width="2"/>
        <line x1="100" y1="50" x2="150" y2="50" stroke="black" stroke-width="2"/>
        <line x1="150" y1="50" x2="150" y2="80" stroke="black" stroke-width="2"/>
    `;

    const parts = [
      '<circle cx="150" cy="100" r="20" stroke="black" stroke-width="2" fill="none"/>',
      '<line x1="150" y1="120" x2="150" y2="180" stroke="black" stroke-width="2"/>',
      '<line x1="150" y1="140" x2="120" y2="160" stroke="black" stroke-width="2"/>',
      '<line x1="150" y1="140" x2="180" y2="160" stroke="black" stroke-width="2"/>',
      '<line x1="150" y1="180" x2="120" y2="220" stroke="black" stroke-width="2"/>',
      '<line x1="150" y1="180" x2="180" y2="220" stroke="black" stroke-width="2"/>'
    ];

    const wrongGuesses = 6 - this.attemptsLeft;
    const visibleParts = parts.slice(0, wrongGuesses).join('');
    const completeSvg = `${baseStructure}${visibleParts}</svg>`;
    this.safeHangmanSvg = this.sanitizer.bypassSecurityTrustHtml(completeSvg);
  }

  guessLetter(letter: string) {
    if (this.gameOver || this.usedLetters.includes(letter)) return;

    this.usedLetters.push(letter);

    if (this.currentWord.includes(letter)) {
      this.updateDisplayWord(letter);
      if (!this.displayWord.includes('_')) {
        this.gameWon = true;
        this.saveScore();
      }
    } else {
      this.wrongLetters.push(letter);
      this.attemptsLeft--;
      this.updateHangmanDrawing();

      if (this.attemptsLeft === 0) {
        this.gameOver = true;
        this.saveScore();
      }
    }
  }

  private updateDisplayWord(letter: string) {
    let newDisplay = '';
    for (let i = 0; i < this.currentWord.length; i++) {
      if (this.currentWord[i] === letter) {
        newDisplay += letter;
      } else {
        newDisplay += this.displayWord[i];
      }
    }
    this.displayWord = newDisplay;
  }

  private saveScore() {
    if (!this.userService.currentUser) {
      console.log('No hay usuario actual');
      return;
    }
    this.gameService.getUserScores(this.userService.currentUser.username)
      .subscribe({
        next: (scores) => {
          console.log('Puntuaciones obtenidas:', scores);
          const gamesPlayed = scores.length;
          const gameId = this.gameService.generateGameId(
            this.userService.currentUser!.username,
            gamesPlayed + 1
          );

          const score = {
            playerName: this.userService.currentUser!.username,
            word: this.currentWord,
            attemptsLeft: this.attemptsLeft,
            score: this.gameService.calculateScore(this.attemptsLeft),
            date: new Date().toISOString(),
            idGame: gameId
          };

          this.gameService.saveScore(score).subscribe({
            next: (savedScore) => console.log('puntos guardados:', savedScore),
            error: (error) => console.error('Error al guardar:', error)
          });
        },
        error: (error) => console.error('Error al obtener puntuaciones:', error)
      });
  }
}