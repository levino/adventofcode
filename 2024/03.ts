import { fold, map, sequence } from 'jsr:@baetheus/fun/array'
import { flow, pipe } from 'jsr:@baetheus/fun/fn'
import { match, split } from 'jsr:@baetheus/fun/string'
import * as O from 'jsr:@baetheus/fun/option'
import { head, tail } from 'npm:ramda'
const muls = match(/mul\(\d*,\d*\)/g)
const mulValues = match(/mul\((\d*),(\d*)\)/)

const removeDisabled = (
    input: string,
) => [
    head(input.split("don't()")),
    tail(input.split("don't()")).map(flow(split('do()'), tail)),
].join('')

export const calculateProduct = (input: string) =>
    pipe(
        input,
        muls,
        O.map(map(mulValues)),
        O.flatmap((value) => sequence(O.ApplicableOption)(...value)),
        O.map(
            fold((acc, item) => {
                const [, a, b] = item as [string, number, number]
                return acc + a * b
            }, 0),
        ),
        O.toNull,
    )

export const calculateProductRespectingConditions = (input: string) =>
    pipe(
        input,
        removeDisabled,
        muls,
        O.map(map(mulValues)),
        O.flatmap((value) => sequence(O.ApplicableOption)(...value)),
        O.map(
            fold((acc, item) => {
                const [, a, b] = item as [string, number, number]
                return acc + a * b
            }, 0),
        ),
        O.toNull,
    )
