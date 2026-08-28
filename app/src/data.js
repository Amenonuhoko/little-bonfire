export const COLOR = {
  disgrace: '#7c6b91',
  ruin: '#a05f4b',
  vigil: '#55707f',
  resolve: '#7f8a5c',
  grace: '#cbb083',
};

export const BONE = '#e6ddcb';
export const BRONZE = '#c2a173';

export const BUCKET_IDS = ['disgrace', 'ruin', 'vigil', 'resolve', 'grace'];

// Grace has no scarcity mechanic (total: 0 means unbounded).
export const BUCKETS = {
  disgrace: {
    name: 'Disgrace',
    color: COLOR.disgrace,
    total: 50,
    blurb: 'You did the thing you said you wouldn’t.',
    parts: [
      { lit: 'I said I wouldn’t, and then I ' },
      { opts: ['did it anyway.', 'did it twice.', 'did it before noon.', 'didn’t even hesitate.'] },
      { lit: ' ' },
      { opts: ['Told no one for a week.', 'Started the count from zero again.', 'Cleaned the kitchen instead of thinking about it.', 'Wrote it down so it would be true.'] },
      { lit: ' ' },
      { opts: ['Still here.', 'It was a Tuesday.', 'Nothing burned down.', 'I stopped keeping the tally.'] },
    ],
    live: [
      { t: 'I said I wouldn’t, and then I did it before noon. Told no one for a week. Nothing burned down.', age: 'day 3 of 9' },
      { t: 'I said I wouldn’t, and then I didn’t even hesitate. Started the count from zero again. I stopped keeping the tally.', age: 'day 6 of 9' },
    ],
  },
  ruin: {
    name: 'Ruin',
    color: COLOR.ruin,
    total: 50,
    blurb: 'Something broke and you don’t know if it’s fixable.',
    parts: [
      { lit: 'It broke while I was ' },
      { opts: ['looking right at it.', 'asleep.', 'holding the rest of it together.', 'somewhere else entirely.'] },
      { lit: ' I thought ' },
      { opts: ['it was fixable.', 'I had caused it.', 'someone would come.', 'I’d get more warning.'] },
      { lit: ' ' },
      { opts: ['Some of it wasn’t.', 'I was half right.', 'No one came.', 'It took a year and then it was fine.'] },
    ],
    live: [
      { t: 'It broke while I was holding the rest of it together. I thought someone would come. No one came.', age: 'day 1 of 9' },
      { t: 'It broke while I was asleep. I thought I had caused it. It took a year and then it was fine.', age: 'day 8 of 9' },
    ],
  },
  vigil: {
    name: 'Vigil',
    color: COLOR.vigil,
    total: 50,
    blurb: 'Waiting on something you can’t control.',
    parts: [
      { lit: '' },
      { opts: ['Third day', 'Sixth week', 'Two hours', 'All winter'] },
      { lit: ' of waiting on ' },
      { opts: ['a letter.', 'someone else’s decision.', 'a scan.', 'a phone that won’t ring.'] },
      { lit: ' I ' },
      { opts: ['cooked.', 'kept the fire going.', 'cleaned things that were already clean.', 'walked the same block eleven times.'] },
      { lit: ' ' },
      { opts: ['It came.', 'It didn’t.', 'The waiting was the whole thing.', 'I slept eventually.'] },
    ],
    live: [
      { t: 'Sixth week of waiting on someone else’s decision. I cleaned things that were already clean. The waiting was the whole thing.', age: 'day 4 of 9' },
      { t: 'Two hours of waiting on a scan. I walked the same block eleven times. I slept eventually.', age: 'day 2 of 9' },
    ],
  },
  resolve: {
    name: 'Resolve',
    color: COLOR.resolve,
    total: 50,
    blurb: 'Decided something, need it to hold.',
    parts: [
      { lit: 'I decided ' },
      { opts: ['at 4am.', 'in a car park.', 'mid-argument.', 'on the way home.'] },
      { lit: ' It held for ' },
      { opts: ['one day.', 'eleven days.', 'about an hour.', 'longer than I expected.'] },
      { lit: ' ' },
      { opts: ['Then I decided again.', 'I wrote it on the wall.', 'Deciding twice is allowed.', 'I’m not telling anyone yet.'] },
    ],
    live: [
      { t: 'I decided in a car park. It held for about an hour. Then I decided again.', age: 'day 5 of 9' },
      { t: 'I decided mid-argument. It held for eleven days. Deciding twice is allowed.', age: 'day 7 of 9' },
    ],
  },
  grace: {
    name: 'Grace',
    color: COLOR.grace,
    total: 0,
    blurb: 'A good moment you don’t want to lose.',
    parts: [
      { lit: '' },
      { opts: ['The light', 'Someone’s laugh', 'A bus arriving', 'The smell of rain'] },
      { lit: ' on ' },
      { opts: ['an ordinary Tuesday.', 'the worst week.', 'the way home.', 'no particular occasion.'] },
      { lit: ' I ' },
      { opts: ['stopped walking.', 'said nothing.', 'took the long way.', 'stayed until it was over.'] },
      { lit: ' ' },
      { opts: ['Filing this one.', 'I’d have missed it a year ago.', 'Nothing happened after.', 'That was the whole day.'] },
    ],
    live: [
      { t: 'The smell of rain on the worst week. I stopped walking. I’d have missed it a year ago.', age: 'unbounded' },
      { t: 'A bus arriving on an ordinary Tuesday. I took the long way. That was the whole day.', age: 'unbounded' },
    ],
  },
};

export const INITIAL_USED = { disgrace: 47, ruin: 50, vigil: 31, resolve: 22, grace: 12 };

export function totalFor(id) {
  return BUCKETS[id].total;
}
