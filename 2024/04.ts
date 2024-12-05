import { Array, flow, pipe, String } from 'npm:effect'

export const countXMas = (input: string) =>
    pipe(
        Array.map([
            lines,
            linesReversed,
            columns,
            columnsReversed,
            topLeftToBottomRightDiagonals,
            topLeftToBottomRightDiagonalsReversed,
            bottomLeftToTopRightDiagonals,
            bottomLeftToTopRightDiagonalsReversed,
        ], (f) => f(input)),
        Array.map(Array.filterMap(String.match(/XMAS/g))),
        Array.reduce(0, (acc, entry) =>
            acc + Array.reduce(entry, 0, (acc2, matches) =>
                acc2 + matches.length)),
    )

const reverseAll = Array.map(flow(Array.reverse, Array.join('')))

const lines = String.split('\n')
const linesReversed = flow(
    lines,
    reverseAll,
)

export const columns = flow(
    lines,
    (lines) =>
        pipe(
            lines,
            Array.reduce(
                Array.makeBy(lines.length, () => []) as string[][],
                (acc, line) =>
                    Array.reduce(line, acc, (cols, value, colNumber) =>
                        Array.replace(
                            cols,
                            colNumber,
                            Array.append(cols[colNumber], value),
                        )),
            ),
            Array.map(Array.join('')),
        ),
)
export const columnsReversed = flow(
    columns,
    Array.map(flow(Array.reverse, Array.join(''))),
)

const diagonals = (lines: string[]) =>
    pipe(
        lines,
        Array.reduce(
            Array.makeBy(lines.length * 2 - 1, () => []) as string[][],
            (acc, line, lineNumber) =>
                Array.reduce(line, acc, (diagonals, value, colNumber) =>
                    Array.replace(
                        diagonals,
                        colNumber - lineNumber + lines.length - 1,
                        Array.append(
                            diagonals[
                                colNumber - lineNumber + lines.length -
                                1
                            ],
                            value,
                        ),
                    )),
        ),
        Array.map(Array.join('')),
    )
export const topLeftToBottomRightDiagonals = (input: string) =>
    pipe(
        input,
        lines,
        diagonals,
    )

const topLeftToBottomRightDiagonalsReversed = flow(
    topLeftToBottomRightDiagonals,
    reverseAll,
)

export const bottomLeftToTopRightDiagonals = flow(
    columnsReversed,
    diagonals,
)

const bottomLeftToTopRightDiagonalsReversed = flow(
    bottomLeftToTopRightDiagonals,
    reverseAll,
)
