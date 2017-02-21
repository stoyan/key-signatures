import React, { Component } from 'react';
import Vex from 'vexflow';
import './App.css';

// const signatures = Object.keys(Vex.Flow.keySignature.keySpecs);
const signatures = [
  ['C',  'Am' ],
  ['F',  'Dm' ],
  ['Bb', 'Gm' ],
  ['Eb', 'Cm' ],
  ['Ab', 'Fm' ],
  ['Db', 'Bbm'],
  ['Gb', 'Ebm'],
  ['Cb', 'Abm'],
  ['G',  'Em' ],
  ['D',  'Bm' ],
  ['A',  'F#m'],
  ['E',  'C#m'],
  ['B',  'G#m'],
  ['F#', 'D#m'],
  ['C#', 'A#m'],
];

let sig;

function getCount() {
  return null;
}
function getQuestion(i) {
  const rand = Math.floor(Math.random() * signatures.length);
  sig = signatures[rand];
  const clef = Math.random() > 0.4 ? 'treble' : 'bass'; // wee bit more treble

  const renderer = new Vex.Flow.Renderer('_vex', Vex.Flow.Renderer.Backends.SVG);
  renderer.resize(150, 220);
  const context = renderer.getContext();
  const stave = new Vex.Flow.Stave(10, 10, 130);
  stave.addClef(clef).addKeySignature(sig[0]);
  stave.setContext(context).draw();
  return context.svg;
}

function getAnswer(i) {
  return (
    <div>
      <h2 style={{paddingTop: '20px'}}>
        {pretty(sig[0])} / {pretty(sig[1])}
      </h2>
      <p>Accidentals: {getAccidentals(sig[0])}</p>
    </div>
  );
}

const sharpsflats = {
  '#': 'FCGDAEB'.split(''),
  'b': 'BEADGCF'.split(''),
};

function getAccidentals(sig) {
  const v = Vex.Flow.keySignature(sig);
  if (v.length === 0) return 'none';
  const acc = v[0].type;
  return pretty(
    sharpsflats[acc]
      .slice(0, v.length)
      .join(', ')
      .replace(/,/g, acc + ',') + acc
  );
}


function pretty(note) {
  return note
    .replace(/#/g, '♯')
    .replace(/b/g, '♭');
}
// the actual quiz is done, boring stuff follows...

class App extends Component {
  constructor() {
    super();
    this.state = {
      question: getQuestion(1),
      answer: getAnswer(1),
      total: getCount(),
      i: 1,
    };
    window.addEventListener('keydown', (e) => {
      // right arrow
      if (e.keyCode === 39 || e.charCode === 39) {
        e.preventDefault();
        this.nextQuestion();
      }
      // n and N
      if (e.keyCode === 110 || e.charCode === 110 || e.keyCode === 78 || e.charCode === 78) {
        e.preventDefault();
        this.nextQuestion();
      }
    });
  }
  
  nextQuestion() {
    this.setState({
      question: getQuestion(this.state.i + 1),
      answer: getAnswer(this.state.i + 1),
      i: this.state.i + 1,
    });
  }
  
  render() {
    return (
      <div>
        {
          this.state.total 
            ? <Count i={this.state.i} total={this.state.total} />
            : null
        }
        <Flashcard 
          question={this.state.question}
          answer={this.state.answer}
        />
        {
          (this.state.total && this.state.i >= this.state.total)
            ? null
            : <button 
                className="nextButton" 
                onClick={this.nextQuestion.bind(this)}>
                next...
              </button>
        }
      </div>
    );
  }
}

class Flashcard extends Component {

  constructor() {
    super();
    this.state = {
      reveal: false,
    };
    window.addEventListener('keydown', (e) => {
      // arrows
      if (e.keyCode === 38 || e.charCode === 38 || e.keyCode === 40 || e.charCode === 40) {
        this.flip();
      }
      // f and F
      if (e.keyCode === 102 || e.charCode === 102 || e.keyCode === 70 || e.charCode === 70) {
        this.flip();
      }
    });
  }

  componentWillReceiveProps() {
    this.setState({reveal: false});
  }

  flip() {
    this.setState({
      reveal: !this.state.reveal,
    });
  }

  render() {
    const className = "card flip-container" + (this.state.reveal ? ' flip' : '');
    return (
      <div><center>
        <div className={className} onClick={this.flip.bind(this)}>
          <div className="flipper">
            <div className="front" style={{display: this.state.reveal ? 'none' : ''}}>
              <div dangerouslySetInnerHTML={{__html: this.props.question.outerHTML}} />
            </div>
            <div className="back" style={{display: this.state.reveal ? '' : 'none'}}>
              {this.props.answer}
            </div>
          </div>
        </div>
        <button className="answerButton" onClick={this.flip.bind(this)}>flip</button>
      </center></div>
    );
  }
}

const Count = ({i, total}) =>
  <div>
    Question {i} / {total}
  </div>;

export default App;
