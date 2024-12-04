import { filter, fold, map, sort, zip } from 'jsr:@baetheus/fun/array'
import { flow, pipe } from 'jsr:@baetheus/fun/fn'
import { replace, split } from 'jsr:@baetheus/fun/string'
import { add, SortableNumber } from 'jsr:@baetheus/fun/number'

export const distance = (list: string) =>
  pipe(
    list,
    parseList,
  )

const parseList = flow(
  replace(/\n/g, '   '),
  split('   '),
  map((input: string) => parseInt(input)),
  (list) => [filterEvens(list), filterOdds(list)],
  map(sort(SortableNumber)),
  ([evens, odds]) => zip(evens, odds),
  map(([left, right]) => Math.abs(right - left)),
  fold((a, b) => add(a)(b), 0),
)

const filterEvens = filter<number>((_, index) => index % 2 === 0)

const filterOdds = filter<number>((_, index) => index % 2 === 1)
