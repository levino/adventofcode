import { split } from 'jsr:@baetheus/fun/string'
import { flow, pipe } from 'jsr:@baetheus/fun/fn'
import { fold, map } from 'jsr:@baetheus/fun/array'

export const numberOfSafeReports = (input: string) =>
  pipe(
    input,
    parseReports,
    checkValidity,
    countValids,
  )

const countValids = fold((acc, valid) => (valid ? acc + 1 : acc), 0)

const checkValidity = (reports: readonly (readonly number[])[]) =>
  pipe(
    reports,
    map(
      (report) =>
        pipe(
          report,
          fold(
            (acc, entry, index) =>
              acc.valid
                ? ({
                  valid: index > 0
                    ? (entry > acc.last && entry - acc.last <= 3 &&
                      entry - acc.last > 0)
                    : true,
                  last: entry,
                })
                : acc,
            { valid: true, last: 0 } as {
              last: number
              valid: boolean
            },
          ),
          ({ valid }) => valid,
        ) ||
        pipe(
          report,
          fold(
            (acc, entry, index) =>
              acc.valid
                ? ({
                  valid: index > 0
                    ? (entry < acc.last && acc.last - entry <= 3 &&
                      acc.last - entry > 0)
                    : true,
                  last: entry,
                })
                : acc,
            { valid: true, last: 0 } as {
              last: number
              valid: boolean
            },
          ),
          ({ valid }) => valid,
        ),
    ),
  )
const parseReports = flow(split('\n'), map(flow(split(' '), map(parseFloat))))
