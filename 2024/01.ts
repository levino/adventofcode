import { filter, fold, map, sort, zip } from 'jsr:@baetheus/fun/array'
import { flow, pipe } from 'jsr:@baetheus/fun/fn'
import { replace, split } from 'jsr:@baetheus/fun/string'
import { add, SortableNumber } from 'jsr:@baetheus/fun/number'

export const distance = (list: string) =>
  pipe(
    list,
    parseList,
    map(sort(SortableNumber)),
    ([leftList, rightList]) => zip(leftList, rightList),
    map(([left, right]) => Math.abs(right - left)),
    fold((a, b) => add(a)(b), 0),
  )

export const similarity = (list: string) =>
  pipe(
    list,
    parseList,
    ([leftList, rightList]) =>
      [leftList, toFactors(rightList)] as [
        readonly number[],
        Record<number, number>,
      ],
    ([leftList, factors]) =>
      pipe(
        leftList,
        fold(
          (acc, value) => acc + (factors[value] ? factors[value] : 0) * value,
          0,
        ),
      ),
  )

const toFactors = (list: readonly number[]) =>
  pipe(
    list,
    fold((acc, value) => ({
      ...acc,
      [value]: acc[value] ? acc[value] + 1 : 1,
    }), {} as Record<number, number>),
  )

const parseList = flow(
  replace(/\n/g, '   '),
  split('   '),
  map((input: string) => parseInt(input)),
  (list) => [filterEvens(list), filterOdds(list)],
)

const filterEvens = filter<number>((_, index) => index % 2 === 0)

const filterOdds = filter<number>((_, index) => index % 2 === 1)
