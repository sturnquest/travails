const chai = require('chai')

chai.should()

const Board = require('../app/services/board')

describe('Board', () => {
  let board = new Board()

  it('translates squares to grid coordinate', () => {
    board.toCoordinate('A1').should.deep.equal([0,0])
    board.toCoordinate('A8').should.deep.equal([0,7])
    board.toCoordinate('H1').should.deep.equal([7,0])
    board.toCoordinate('H8').should.deep.equal([7,7])
  })

  it('translates grid coordinates to squares', () => {
    board.toSquare([0,0]).should.equal('A1')
    board.toSquare([0,7]).should.equal('A8')
    board.toSquare([7,0]).should.equal('H1')
    board.toSquare([7,7]).should.equal('H8')
  })

  it('only returns valid next moves', () => {
    board.nextMoveOptions('D4').should.deep.equal(['C2', 'E6', 'C6', 'F5', 'F3', 'E2', 'B5', 'B3'])
    board.nextMoveOptions('A6').should.deep.equal(['B8', 'C7', 'C5', 'B4'])
    board.nextMoveOptions('H8').should.deep.equal(['G6', 'F7'])
  })

  it('returns shortest sequence of moves', () => {
    board.minSequence('A8', 'B7').should.deep.equal(['C7', 'B5', 'D6', 'B7'])
    board.minSequence('D3', 'F2').should.deep.equal(['F2'])
  })

  it('throws when no moves needed', () => {
    (function() {
      board.minSequence('C4', 'C4')
    }).should.throw(Error, /No moves needed/)
  })

})
