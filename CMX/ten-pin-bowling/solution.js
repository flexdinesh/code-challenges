FinalFrame = function(game) {
  this.throw1 = new Throw(this);
  this.throw2 = new SecondThrow(this);
  this.throw3 = new ThirdThrow(this);
  this.game = game;
  this.throwScore = null;
  this.bonusScore = null;
  this.totalScore = null;
  this.type = 'FinalFrame';
};

FinalFrame.prototype._calculateThrowScore = function() {
  if (this.isStrike()) {
    this.throwScore = this.throw1.score;
  } else {
    this.throwScore = this.throw1.score + this.throw2.score;
  }
  return this.throwScore;
};

FinalFrame.prototype._calculateBonusScore = function() {
  if (this.isStrike()) {
    this.bonusScore = this.throw2.score + this.throw3.score;
  } else if (this.isSpare()) {
    this.bonusScore = this.throw3.score;
  }
  return this.bonusScore;
};

FinalFrame.prototype.isStrike = function() {
  return this.throw1.score === 10;
};

FinalFrame.prototype.isSpare = function() {
  return this.throwScore === 10;
};

FinalFrame.prototype.calculateTotalScore = function() {
  this._calculateThrowScore();
  this._calculateBonusScore();
  this.totalScore = this.throwScore + this.bonusScore;
  return this.totalScore;
};

Frame = function(game) {
  this.throw1 = new Throw(this);
  this.throw2 = new SecondThrow(this);
  this.game = game;
  this.throwScore = null;
  this.bonusScore = null;
  this.totalScore = null;
};

Frame.prototype.calculateThrowScore = function() {
  if (this.throw2.score === null) {
    this.throwScore = this.throw1.score;
  } else {
    this.throwScore = this.throw1.score + this.throw2.score;
  }
  return this.throwScore;
};

Frame.prototype.calculateBonusScore = function() {
  if (this.isStrike()) {
    this.strikeBonusCalc();
  } else if (this.isSpare()) {
    this.spareBonus();
  }
  return this.bonusScore;
};

Frame.prototype.strikeBonusCalc = function() {
  if (this.isNextFrameStrike() && this.whatFrame() !== 8) {
    this.doubleStrikeBonus();
  } else {
    this.strikeStandardBonus();
  }
};

Frame.prototype.calculateTotalScore = function() {
  this.calculateThrowScore();
  this.calculateBonusScore();
  this.totalScore = this.throwScore + this.bonusScore;
};

Frame.prototype.whatGame = function() {
  return this.game;
};

Frame.prototype.whatFrame = function() {
  const thisIndex = this.game.frames.indexOf(this);
  return thisIndex;
};

Frame.prototype.nextFrameIndex = function() {
  const nextIndex = this.whatFrame() + 1;
  return nextIndex;
};

Frame.prototype.nextNextFrameIndex = function() {
  const nextNextIndex = this.whatFrame() + 2;
  return nextNextIndex;
};

Frame.prototype.nextFrameFirstThrow = function() {
  i = this.nextFrameIndex();
  return this.game.frames[i].throw1.score;
};

Frame.prototype.nextFrameSecondThrow = function() {
  i = this.nextFrameIndex();
  return this.game.frames[i].throw2.score;
};

Frame.prototype.nextNextFrameFirstThrow = function() {
  j = this.nextNextFrameIndex();
  return this.game.frames[j].throw1.score;
};

Frame.prototype.isStrike = function() {
  return this.throw1.score === 10;
};

Frame.prototype.isSpare = function() {
  return this.throwScore === 10;
};

Frame.prototype.isStrikeOnEightFrame = function() {
  return this.isStrike() && this.nextFrameIndex() === 9;
};

Frame.prototype.isNextFrameStrike = function() {
  return this.nextFrameFirstThrow() === 10;
};

Frame.prototype.isStrikeNotOnEigthFrame = function() {
  return this.isStrike() && this.nextFrameIndex() !== 9;
};

Frame.prototype.strikeStandardBonus = function() {
  this.bonusScore = this.nextFrameFirstThrow() + this.nextFrameSecondThrow();
};

Frame.prototype.doubleStrikeBonus = function() {
  this.bonusScore = this.nextFrameFirstThrow() + this.nextNextFrameFirstThrow();
};

Frame.prototype.spareBonus = function() {
  this.bonusScore = this.nextFrameFirstThrow();
};

Game = function() {
  this.frames = [
    new Frame(this),
    (frame2 = new Frame(this)),
    (frame3 = new Frame(this)),
    (frame4 = new Frame(this)),
    (frame5 = new Frame(this)),
    (frame6 = new Frame(this)),
    (frame7 = new Frame(this)),
    (frame8 = new Frame(this)),
    (frame9 = new Frame(this)),
    (frame10 = new FinalFrame(this))
  ];
  this.frameScores = [];
  this.gameScore = null;
};

Game.prototype.calculateGameScore = function() {
  this.collateFrameScores();
  this.gameScore = this.frameScores.reduce(function(a, b) {
    return a + b;
  });
  return this.gameScore;
};

Game.prototype.collateFrameScores = function(first_argument) {
  let j;
  for (i = 0; i < this.frames.length; i++) {
    j = this.frames[i].totalScore;
    if (j !== null) {
      this.frameScores.push(j);
    } else {
      this.frameScores.push(0);
    }
  }
};

const whatFrame = function() {
  return this.frame;
};

const notAllPinsDown = function(pinsDown) {
  return pinsDown <= 10;
};

// First Throw

function Throw(frame) {
  this.score = null;
  this.frame = frame;
}

Throw.prototype.assignScore = function(pinsDown) {
  if (this.notAllPinsDown(pinsDown)) {
    this.score = pinsDown;
  }
  return this.score;
};

Throw.prototype.whatFrame = whatFrame;
Throw.prototype.notAllPinsDown = notAllPinsDown;

// Second Throw

function SecondThrow(frame) {
  this.score = null;
  this.frame = frame;
}

SecondThrow.prototype.whatFrame = whatFrame;
SecondThrow.prototype.notAllPinsDown = notAllPinsDown;

SecondThrow.prototype.throw1Score = function() {
  return this.frame.throw1.score;
};

SecondThrow.prototype.assignScore = function(pinsDown) {
  if (this.isFinalFrame() && this.notAllPinsDown(pinsDown)) {
    this.score = pinsDown;
  } else if (pinsDown <= 10 - this.throw1Score()) {
    this.score = pinsDown;
  }
  return this.score;
};

SecondThrow.prototype.isFinalFrame = function() {
  return this.frame.type === 'FinalFrame';
};

// Third Throw

function ThirdThrow(frame) {
  this.score = null;
  this.frame = frame;
}

ThirdThrow.prototype.whatFrame = whatFrame;
ThirdThrow.prototype.notAllPinsDown = notAllPinsDown;

ThirdThrow.prototype.throw1Score = function() {
  return this.frame.throw1.score;
};

ThirdThrow.prototype.assignThirdScore = function(pinsDown) {
  if (this.notAllPinsDown(pinsDown)) {
    this.score = pinsDown;
  }
  return this.score;
};

const calculateEachFrameScore = function(gameName) {
  for (h = 0; h < 10; h++) {
    gameName.frames[h].calculateTotalScore();
  }
};

function bowlingScore(frames) {
  const game = new Game();
  
  const splitFrames = frames.split(" ");
  for (i = 0; i < 9; i++) {
    if (splitFrames[i] === 'X') {
      game.frames[i].throw1.assignScore(10);
    }
    else if (splitFrames[i].indexOf('/') !== -1) {
      const splitThrows = splitFrames[i].split("/");
      game.frames[i].throw1.assignScore(Number(splitThrows[0]));
      game.frames[i].throw2.assignScore(10 - Number(splitThrows[0]));
    }
    else {
      const splitThrows = splitFrames[i].split("");
      game.frames[i].throw1.assignScore(Number(splitThrows[0]));
      game.frames[i].throw2.assignScore(Number(splitThrows[1]));
    }
  }
  
  const lastFrame = splitFrames[9].split("");
  for (i = 0; i < lastFrame.length; i++) {
    let scoreToAssign = 0;
    if (!isNaN(lastFrame[i])) {
      scoreToAssign = Number(lastFrame[i]);
    } else if (lastFrame[i] === '/'){
      scoreToAssign = 10 - Number(lastFrame[i-1]);
    } else if (lastFrame[i] === 'X') {
      scoreToAssign = 10;
    }
    
    if (i === 0) game.frames[9].throw1.assignScore(scoreToAssign);
    else if (i === 1) game.frames[9].throw2.assignScore(scoreToAssign);
    else if (i === 2) game.frames[9].throw3.assignThirdScore(scoreToAssign);
  }
  
  calculateEachFrameScore(game);
  
  return game.calculateGameScore();
}
