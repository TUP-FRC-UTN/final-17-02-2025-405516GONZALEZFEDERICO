import { Component, inject, OnInit } from '@angular/core';
import { Score } from '../../interfaces/interface-final';
import { GameService } from '../../services/game/game.service';
import { ServiceFinalService } from '../../services/login/service-final.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-score',
  imports: [CommonModule, NavbarComponent],
  templateUrl: './score.component.html',
  styleUrl: './score.component.css'
})
export class ScoreComponent implements OnInit {
  scores: Score[] = [];
  private gameService = inject(GameService);
  private userService = inject(ServiceFinalService);

  ngOnInit() {
    const currentUser = this.userService.currentUser;
    if (!currentUser) return;

    this.gameService.getScores().subscribe(scores => {
      if (currentUser.role === 'admin') {
        this.scores = scores;
      } else {

        this.scores = scores.filter(score =>
          score.playerName === currentUser.username
        );
      }
    });
  }
}
