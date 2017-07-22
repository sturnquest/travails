'use strict'

const readline = require('readline');
const fs = require('fs');

const eolByteCount = 1 // assume only 1 byte for end of line character e.g. \n

const xCoordinateMap = {'A': 0, 'B': 1, 'C': 2, 'D': 3, 'E': 4, 'F': 5, 'G': 6, 'H': 7}
const yCoordinateMap = {'1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5, '7': 6, '8': 7}
const xSquareMap = {0: 'A', 1: 'B', 2: 'C', 3: 'D', 4: 'E', 5: 'F', 6: 'G', 7: 'H'}
const ySquareMap = {0: '1', 1: '2', 2: '3', 3: '4', 4: '5', 5: '6', 6: '7', 7: '8'}

class Board {

  toCoordinate(square) {
    return [xCoordinateMap[square.charAt(0)], yCoordinateMap[square.charAt(1)]]
  }

  toSquare(coordinate) {
    return xSquareMap[coordinate[0]] + ySquareMap[coordinate[1]]
  }

  validSquare(square) {
    return square && square.length === 2 && this.inBounds(this.toCoordinate(square))
  }

  inBounds(coordinate) {
    return coordinate[0] >= 0 && coordinate[0] < 8 && coordinate[1] >= 0 && coordinate[1] < 8
  }

  nextMoveOptions(square) {
    let originCoordinate = this.toCoordinate(square)
    let coordinateOptions = [
      [originCoordinate[0] + 1, originCoordinate[1] + 2], // two steps up. one step right
      [originCoordinate[0] - 1, originCoordinate[1] + 2], // two steps up. one step left
      [originCoordinate[0] + 2, originCoordinate[1] + 1], // two steps right. one step up
      [originCoordinate[0] + 2, originCoordinate[1] - 1], // two steps right. one step down
      [originCoordinate[0] + 1, originCoordinate[1] - 2], // two steps down. one step right
      [originCoordinate[0] - 1, originCoordinate[1] - 2], // two steps down. one step left
      [originCoordinate[0] - 2, originCoordinate[1] + 1], // two steps left. one step up
      [originCoordinate[0] - 2, originCoordinate[1] - 1], // two steps left. one step down
    ]

    return coordinateOptions.filter(this.inBounds).map(this.toSquare)
  }

  uniqueNextMoveOptions(square, visitedSquares) {
    return this.nextMoveOptions(square).filter((nextMove) => {
      return !visitedSquares.has(nextMove)
    })
  }

  breadthFirstMoves(sequences, visitedSquares) {
    let newVisitedSquares = new Set(visitedSquares)
    let newSequences = []

    for (let sequence of sequences) {
      let square = sequence[sequence.length - 1]
      let nextMoveOptions = this.uniqueNextMoveOptions(square, newVisitedSquares)
      nextMoveOptions.forEach((s) => {
        newVisitedSquares.add(s)
        let newSequence = sequence.concat([s])
        newSequences.push(newSequence)
      })
    }

    return {
      sequences: newSequences,
      visitedSquares: newVisitedSquares
    }

  }

  minSequence(startSquare, endSquare) {
    if (startSquare === endSquare) {
      throw new Error('No moves needed. Start square and end square are the same.')
    }

    let visitedSquares = new Set([startSquare])
    let sequences = [[startSquare]]
    let maxPossibleMoves = 64 // we never visit the same square twice so we know the upper limit on number of moves won't exceed 8^2

    for (let i = 0; i < maxPossibleMoves; i++) {
      let breadthFirstResult = this.breadthFirstMoves(sequences, visitedSquares)
      sequences = breadthFirstResult.sequences
      visitedSquares = breadthFirstResult.visitedSquares

      for (let sequence of sequences) {
        if (sequence[sequence.length - 1] === endSquare) {
          sequence.shift()
          return sequence // since we're doing a breadth first search the first completed sequence is the shortest
        }
      }
    }

    throw new Error('No moves sequence found.')
  }
}

module.exports = Board
