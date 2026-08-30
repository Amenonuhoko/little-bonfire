export const COLOR = {
  disgrace: '#7c6b91',
  ruin: '#a05f4b',
  vigil: '#55707f',
  resolve: '#7f8a5c',
  grace: '#cbb083',
};

export const BONE = '#e6ddcb';
export const BRONZE = '#c2a173';

export const KINDLING_IDS = ['disgrace', 'ruin', 'vigil', 'resolve', 'grace'];

// Each kindling holds several "flavors" — distinct emotional shapes of the
// same struggle, not just reworded copies of one template. A user picks
// the flavor that actually matches their moment (see the template wheel
// in ComposeScreen), then fills in that flavor's blanks. Every blank's
// option set favors dense, evocative language over either bland safety
// or an over-specific named scenario — texture without pinning the
// referent down to one story.

// Grace has no scarcity mechanic (total: 0 means unbounded).
export const KINDLING = {
  disgrace: {
    name: 'Disgrace',
    color: COLOR.disgrace,
    total: 50,
    blurb: "You did the thing you said you wouldn't.",
    templates: [
      {
        key: 'just-this-once',
        label: 'Just this once',
        parts: [
          { lit: 'I told myself it was the exception. ' },
          { opts: ["Just this once, because of the week I'd had.", "Just this once, since no one would know the difference.", "Just this once, because I'd earned a break from myself.", "Just this once, and I almost believed it.", "Just this once — the same sentence as last time.", "Just this once, because the rule felt cruel that day."] },
          { lit: ' ' },
          { opts: ["The exception took less convincing than I expected.", "It didn't feel like an exception once I was in it.", "I built the whole excuse before I'd even decided.", "The reasoning fell apart about ten minutes in.", "I heard myself say it and didn't believe it either.", "It felt reasonable right up until it didn't."] },
          { lit: ' ' },
          { opts: ["Every rule I've broken started with that sentence.", "I know there's no such thing as just once.", "Tomorrow the exception becomes the rule again, quietly.", "I'm not even sure who I was arguing with.", "The exception is doing a lot of work these days.", "I'll retire the phrase right after I use it once more."] },
        ],
      },
      {
        key: 'autopilot',
        label: 'Autopilot',
        parts: [
          { lit: "I didn't decide to. I just " },
          { opts: ["drifted into it the way water finds a crack.", "was doing it before I noticed I'd started.", "went through the motions like they were muscle memory.", "ended up there without choosing the route.", "noticed my hands were already doing it.", "skipped the part where I usually talk myself out of it."] },
          { lit: ' ' },
          { opts: ["The decision happened somewhere I wasn't paying attention.", "I only caught up to myself halfway through.", "It's scarier than choosing it on purpose, somehow.", "Autopilot doesn't ask permission.", "I've apparently been rehearsing this without meaning to.", "The absence of a decision felt like its own kind of decision."] },
          { lit: ' ' },
          { opts: ["I need to start paying attention to my own hands.", "Not deciding is still a kind of choosing, I know.", "I want to blame the autopilot. I built it, though.", "Next time I'll notice sooner. Maybe.", "It's unsettling, not being the one driving.", "I'm going to need a better warning system than guilt."] },
        ],
      },
      {
        key: 'relapse',
        label: 'Relapse',
        parts: [
          { lit: 'It came back like it never left. I ' },
          { opts: ["let it in without a fight.", "didn't even reach for the usual excuse.", "felt relief before I felt shame.", "went quiet the way I always do.", "gave it the whole evening.", "stopped pretending I'd say no."] },
          { lit: ' ' },
          { opts: ["Told myself it was the last time. Again.", "Didn't tell the people counting on me.", "Deleted the streak and started over.", "Sat with it until it stopped being news.", "Called it a slip, not a fall.", "Felt the old shame settle back in, familiar."] },
          { lit: ' ' },
          { opts: ["It knows the way back better than I do.", "I'm not surprised. That's the worst part.", "Tomorrow I'll act like today didn't happen.", "The version of me that quit is still in here somewhere.", "I've stopped being shocked by myself.", "It'll take more than shame to keep it out this time."] },
        ],
      },
      {
        key: 'snap',
        label: 'Snap',
        parts: [
          { lit: 'I lost it before I decided to. ' },
          { opts: ["Said the thing I'd promised myself I never would.", "Slammed something that didn't deserve it.", "Went cold instead of loud, which was worse.", "Let ten years of patience run out at once.", "Turned into someone I don't recognize for about a minute.", "Said it in front of exactly the wrong person."] },
          { lit: ' ' },
          { opts: ["Apologized before I'd even finished.", "Didn't apologize, and that's its own kind of shame.", "Watched their face change and couldn't take it back.", "Left before I could make it worse.", "Felt the adrenaline outlast the anger by an hour.", "Sat in the car until I could breathe normal again."] },
          { lit: ' ' },
          { opts: ["I know exactly what set it off. That's not an excuse.", "It wasn't about them, not really.", "I'll be making up for this one a while.", "The old me would've been proud. That's the problem.", "Nobody died. It still felt like something did.", "I keep replaying the ten seconds before I lost it."] },
        ],
      },
      {
        key: 'broken-promise',
        label: 'Broken promise',
        parts: [
          { lit: 'I promised ' },
          { opts: ["someone who believed me too easily", "the person it would hurt the most", "someone who'd already forgiven me for this once", "the one person who never asks twice", "someone who trusted the promise more than they trusted me", "a version of someone I don't get to keep disappointing"] },
          { lit: ' I wouldn’t. I did. ' },
          { opts: ["I haven't figured out how to tell them yet.", "They'll find out the way they always do — not from me.", "I rehearsed the apology before I'd even finished doing it.", "Some promises cost more to break the second time.", "I keep the guilt closer than the reason I did it.", "It wasn't about them. It still landed on them."] },
          { lit: ' ' },
          { opts: ["Trust doesn't come back at the same price it left.", "I'd rather they were angry than quietly disappointed.", "I'm the reason the bar keeps getting lower.", "Sorry doesn't undo the second time.", "I know what this one costs. I did it anyway.", "They deserved the version of me that keeps promises."] },
        ],
      },
      {
        key: 'secret',
        label: 'Secret',
        parts: [
          { lit: 'I did it where no one could see. ' },
          { opts: ["Timed it for when the house was empty.", "Made sure the evidence wouldn't outlast the hour.", "Told a small lie to buy the privacy.", "Did it in a different room than usual, just in case.", "Waited until everyone I love was asleep.", "Chose the one hour nobody checks in on me."] },
          { lit: ' ' },
          { opts: ["The secrecy was almost the whole point.", "Being unseen made it feel like it didn't count.", "I've gotten good at this kind of quiet.", "Some part of me wanted to get caught.", "It's lonelier than the thing itself.", "I don't know who I'm protecting anymore — them or me."] },
          { lit: ' ' },
          { opts: ["Nobody knows. That's not the same as nobody's hurt.", "I'll carry this one alone, same as always.", "The secret weighs more than the thing did.", "I almost told someone. Almost.", "It's easier to hide than to stop.", "One day the math on this stops working."] },
        ],
      },
      {
        key: 'caught',
        label: 'Caught',
        parts: [
          { lit: 'I did it in front of ' },
          { opts: ["someone whose opinion still matters too much.", "the one person I'd told I'd stopped.", "a stranger, which somehow made it worse.", "my own reflection, which doesn't blink.", "the version of myself I used to be.", "someone who didn't say anything, which said everything."] },
          { lit: ' I ' },
          { opts: ["didn't stop. Just got quieter about it.", "made a joke so it would land softer.", "watched their face do the math.", "kept going like it wasn't happening.", "felt the shame arrive a beat too late to help.", 'said "it\'s not what it looks like." It was.'] },
          { lit: ' ' },
          { opts: ["They haven't brought it up. I wish they would.", "Some part of me is relieved it's out.", "I don't know how to undo being seen like that.", "It changes things, being caught instead of just being wrong.", "I keep waiting for them to treat me differently. They haven't, yet.", "Witnessed is a different kind of guilty."] },
        ],
      },
      {
        key: 'old-self',
        label: 'Old self',
        parts: [
          { lit: 'A version of me I thought was gone showed up. ' },
          { opts: ["Same voice, same excuses, like no time had passed.", "Wearing a face I used to hate looking at.", "Right on schedule, like it never left town.", "Uninvited, and I let it in anyway.", "More familiar than I want to admit.", "Comfortable, which was the scariest part."] },
          { lit: ' ' },
          { opts: ["I thought I'd outgrown this one.", "It knew exactly where I keep the spare key.", "I recognized the pattern three moves too late.", "Some habits just wait. They don't die.", "It felt like putting on old clothes that still fit.", "I didn't fight it as hard as I should have."] },
          { lit: ' ' },
          { opts: ["Growth apparently isn't a straight line. Noted, again.", "I'll introduce myself to the better version tomorrow.", "It's humbling, meeting yourself at your worst, unannounced.", "I'm not who I was. I'm also, apparently, still him.", "The old self left before I could ask it to stay gone.", "I'm keeping the receipt on this one, for later."] },
        ],
      },
      {
        key: 'defiance',
        label: 'Defiance',
        parts: [
          { lit: 'I did it on purpose, knowing exactly what it would cost. ' },
          { opts: ["Some part of me wanted the consequence more than the thing.", "I wasn't sorry in the moment, and that scared me.", "It felt like the only honest thing I'd done all week.", "I looked right at the rule before I broke it.", "For once I didn't want to be talked out of it.", "It felt less like slipping and more like choosing."] },
          { lit: ' ' },
          { opts: ["I'm still deciding if that makes it worse or just more honest.", "Nobody talked me into it. I did that part myself.", "It didn't feel like weakness. That's what worries me.", "I wanted to see what would happen if I stopped asking permission.", "The defiance felt better than the thing itself did.", "I knew the price and paid it anyway, eyes open."] },
          { lit: ' ' },
          { opts: ["I'm not sure I regret it. I regret that I don't.", "At least this time it was honestly mine.", "Doing it on purpose doesn't make it hurt less, just differently.", "I'd like to say it was the last time. I won't.", "Some rules I break out of weakness. This wasn't that.", "I chose it. I'll own the whole thing, for once."] },
        ],
      },
    ],
    live: [
      { t: "I said I wouldn't, and then I did it before noon. Told no one for a week. Nothing burned down.", age: 'day 3 of 9' },
      { t: "I said I wouldn't, and then I didn't even hesitate. Started the count from zero again. I stopped keeping the tally.", age: 'day 6 of 9' },
    ],
  },

  ruin: {
    name: 'Ruin',
    color: COLOR.ruin,
    total: 50,
    blurb: "Something broke and you don't know if it's fixable.",
    templates: [
      {
        key: 'sudden-break',
        label: 'Sudden break',
        parts: [
          { lit: 'It went without warning. ' },
          { opts: ["One second it was fine, the next it wasn't.", "There was no sound before the silence after.", "I didn't get the chance to brace for it.", "It happened faster than I could reach for it.", "No warning light, no sign, just gone.", "The kind of sudden that doesn't leave room to prepare."] },
          { lit: ' I thought ' },
          { opts: ["it had more time left in it.", "I'd get some kind of warning.", "I would've done something differently, if I'd known.", "it would at least give me a reason.", "the ordinary day meant it was safe.", "nothing that fine could go that wrong that fast."] },
          { lit: ' ' },
          { opts: ["Some things don't announce themselves before they leave.", "I'm still catching up to how fast it was.", "There's no lesson in it, just the fact of it.", "I keep looking for the moment I could've caught it.", "It didn't ask if I was ready.", "Sudden doesn't get easier with practice."] },
        ],
      },
      {
        key: 'slow-leak',
        label: 'Slow leak',
        parts: [
          { lit: 'I watched it fail a little at a time. ' },
          { opts: ["Told myself it was still mostly fine.", "Kept patching the same spot, differently each time.", "Noticed and said nothing, for longer than I should have.", "Got used to the smaller version of it.", "Assumed I had more time to fix it properly.", "Watched the gap get a little wider each week."] },
          { lit: ' I thought ' },
          { opts: ["I could catch it before it went all the way.", "slow meant fixable.", "I'd deal with it once things calmed down.", "it would stabilize on its own.", "I had longer than I did.", "patience would work where action should have."] },
          { lit: ' ' },
          { opts: ["By the time I acted, there wasn't much left to save.", "Slow doesn't mean gentle. It just means I saw it coming.", "I had time to stop it and spent it hoping instead.", "The end wasn't a surprise. That didn't make it easier.", "I'll know the early signs next time. I hope.", "Watching it happen slowly might be worse than sudden."] },
        ],
      },
      {
        key: 'betrayal',
        label: 'Betrayal',
        parts: [
          { lit: 'Someone else broke it, not me. ' },
          { opts: ["They didn't think it counted as breaking.", "They had their reasons. I still don't fully believe them.", "It wasn't malicious. It still landed like it was.", "They probably don't know how much it cost.", "I don't think they meant to. I still can't unknow it.", "They did it carefully, which somehow made it worse."] },
          { lit: ' I thought ' },
          { opts: ["I was the only one who could damage it.", "trust meant it was safe from that.", "they'd have told me if something changed.", "it would take more than this to break.", "that kind of thing only happened to other people.", "I'd get a say in it, at least."] },
          { lit: ' ' },
          { opts: ["I'm still deciding whether to say something.", "It's not the break I'm angriest about — it's who caused it.", "Forgiving them and fixing it are two separate jobs.", "I keep the anger somewhere I can find it later.", "Nobody warned me it could come from that direction.", "It'll heal. It won't forget who did it."] },
        ],
      },
      {
        key: 'discovered-late',
        label: 'Discovered late',
        parts: [
          { lit: 'It had been broken a while before I noticed. ' },
          { opts: ["Everything looked fine from where I was standing.", "I'd stopped checking, which is its own kind of blame.", "It broke quietly enough to hide from me for weeks.", "I was looking somewhere else when it happened.", "By the time I saw it, it had already settled into broken.", "Nobody thought to tell me until it was old news."] },
          { lit: ' I thought ' },
          { opts: ["no news meant it was fine.", "I would've felt it if something changed.", "someone would have said something sooner.", "it takes longer than that to fall apart.", "I was paying enough attention to catch it.", "the silence meant everything was holding."] },
          { lit: ' ' },
          { opts: ["I lost time I didn't know I was losing.", "There's no fixing the part where I wasn't looking.", "I'm angrier at the delay than the break itself.", "It's strange, grieving something that ended before you knew it started ending.", "I'll check more carefully from now on. Too late helps, some.", "The gap between broken and noticed is its own kind of loss."] },
        ],
      },
      {
        key: 'bad-luck',
        label: 'Bad luck',
        parts: [
          { lit: "No one's fault. It just happened. " },
          { opts: ["Wrong place, wrong time, no one to blame for it.", "The odds finally caught up with something.", "It wasn't a decision anyone made. It was just weather.", "There's no story here, just bad timing.", "I looked for someone to be angry at. There wasn't one.", "It happened the way these things sometimes just do."] },
          { lit: ' I thought ' },
          { opts: ["I was due for something going right instead.", "luck evened out eventually.", "I'd get some warning even from chance.", "it couldn't happen twice to the same person.", "fairness had something to do with any of this.", "I was owed better timing than that."] },
          { lit: ' ' },
          { opts: ["There's nothing to learn from bad luck except that it exists.", "I wanted someone to blame. Anger needs a direction.", "It's harder to grieve something nobody chose to break.", "I keep looking for the lesson. Maybe there isn't one.", "Some things really are just unlucky. This was one.", "I'm allowed to be upset even without a villain."] },
        ],
      },
      {
        key: 'broke-again',
        label: 'Broke again',
        parts: [
          { lit: "It was already fragile. This time it didn't come back. " },
          { opts: ["I knew the crack was there and hoped it would hold anyway.", "We'd fixed it before, so I assumed we could again.", "It had one more break left in it, and it used it.", "The second time took less than the first.", "I recognized the sound before I saw the damage.", "It went in the exact spot it broke last time."] },
          { lit: ' I thought ' },
          { opts: ["it had learned to hold from the first time.", "a second break couldn't be as bad as the first.", "we'd already used up our bad luck on this.", "fixed things stay fixed.", "I'd get more warning the second time around.", "it was stronger for having broken once already."] },
          { lit: ' ' },
          { opts: ["Some things don't get a third try.", "The repair held longer than the original did, at least.", "I'm not sure this one comes back from twice.", "It's a different kind of grief, losing something already cracked.", "I knew this day might come. Knowing didn't help.", "Second breaks don't get easier. They get quieter."] },
        ],
      },
      {
        key: 'failed-by-a-system',
        label: 'Failed by a system',
        parts: [
          { lit: 'Something bigger than me let it fail. ' },
          { opts: ["The process was built to lose things like this.", "Nobody in charge was actually paying attention.", "It fell through a gap that was always going to be there.", "The rules protected everyone except the person they were for.", "I did everything right and it still wasn't enough.", "It broke exactly where the paperwork stopped caring."] },
          { lit: ' I thought ' },
          { opts: ["the system existed to catch things like this.", "someone was accountable if it went wrong.", "following the process would be enough.", "there'd be a person, not just a policy.", "doing it right would matter more than it did.", "it was built for people, not just for itself."] },
          { lit: ' ' },
          { opts: ["I'm angrier at the shrug than at the failure itself.", "Nobody apologized, because nobody had to.", "It's hard to be furious at something with no face.", "I did my part. The system didn't do its.", "I'll keep the paper trail, for whatever that's worth.", "Some things break because they were never built to hold."] },
        ],
      },
      {
        key: 'collateral',
        label: 'Collateral',
        parts: [
          { lit: 'It broke because something next to it did. ' },
          { opts: ["It wasn't even the target. It just happened to be close.", "One thing went down and took the other with it.", "It was standing too near something that was already failing.", "The damage spread further than anyone expected.", "It survived the first hit and not the aftershock.", "Nothing about it was the problem. Proximity was."] },
          { lit: ' I thought ' },
          { opts: ["it was far enough away to be safe.", "they weren't connected closely enough to fall together.", "I could protect one without losing the other.", "it would be spared, being the sturdier one.", "the damage would stay where it started.", "distance would matter more than it did."] },
          { lit: ' ' },
          { opts: ["I'm mourning two things now instead of one.", "It's hard to be angry at something for just standing nearby.", "The collateral damage is sometimes worse than the original break.", "I didn't see how connected they were until this.", "Everything near the break gets a little broken too.", "I'll keep more distance next time. If that's even possible."] },
        ],
      },
      {
        key: 'load-bearing',
        label: 'Load-bearing',
        parts: [
          { lit: 'Turns out it was holding up more than I knew. ' },
          { opts: ["I didn't notice what it was carrying until it stopped.", "Everything around it shifted the second it gave out.", "It looked small. It wasn't small at all.", "I'd underestimated exactly how much depended on it.", "The rest of it started cracking within the week.", "I only understood its job by watching everything else move."] },
          { lit: ' I thought ' },
          { opts: ["it was just one small piece among many.", "the rest would hold even if this part didn't.", "it wasn't important enough to matter this much.", "other things were doing the heavy lifting.", "losing it would be simple, contained.", "I'd notice sooner if something this big depended on it."] },
          { lit: ' ' },
          { opts: ["I'm still finding out what else it was holding up.", "Small things are load-bearing more often than we think.", "I owe it an apology for underestimating it.", "The rest of the structure is unstable now too.", "I didn't know what I had until it stopped holding.", "Everything's a little more fragile than I realized, apparently."] },
        ],
      },
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
    blurb: "Waiting on something you can't control.",
    templates: [
      {
        key: 'person-wait',
        label: 'Person wait',
        parts: [
          { lit: '' },
          { opts: ['Four days', 'A week of silence', 'Since the last text', 'Since they said they’d call', 'Two weeks now', 'Since "talk soon"'] },
          { lit: ' since I heard from ' },
          { opts: ["someone who used to answer faster than this.", "the one person whose silence actually means something.", "someone I'm trying not to read too much into.", "a person who knows exactly how loud their silence is.", 'whoever\'s on the other end of "I\'ll let you know."', "someone who owes me an answer, not an explanation."] },
          { lit: ' I ' },
          { opts: ["reread the last message more than once.", "didn't send the follow-up I drafted three times.", "told myself busy and unwilling look the same from here.", "kept my phone closer than usual.", "decided not to be the one who checks first. Then checked.", "practiced what I'd say either way this goes."] },
          { lit: ' ' },
          { opts: ["Silence is an answer. I just don't like this one.", "I'd rather hear something bad than nothing at all.", "Still nothing. I'm getting used to the shape of it.", "They came through, eventually. Later than I needed.", "I stopped waiting before they stopped being quiet.", "Some silences you learn to read like a language."] },
        ],
      },
      {
        key: 'decision-wait',
        label: 'Decision wait',
        parts: [
          { lit: '' },
          { opts: ['A month', 'Since the interview', 'Two rounds of paperwork', 'Since I signed the last form', 'Weeks now', 'Since it left my hands'] },
          { lit: ' since I handed this over to ' },
          { opts: ["people who've never met me deciding this.", "a committee I'll never get to speak to.", "someone who has better things to think about than my one file.", "a process that doesn't explain itself.", "whoever reads applications on a Tuesday.", "a decision I don't get a vote in."] },
          { lit: ' I ' },
          { opts: ["refreshed the portal more than I'd admit.", "stopped checking, on principle, for about a day.", "made backup plans I don't want to need.", "told people less than they wanted to know.", "kept living like it was already decided.", "practiced sounding fine either way it goes."] },
          { lit: ' ' },
          { opts: ["The waiting is the closest I get to control.", "It'll be decided with or without my checking.", "I hate how much of my mood depends on strangers.", "Still nothing. Still theirs to decide.", "I've made peace with not being the one who chooses.", "Whatever they decide, I decided to be okay first."] },
        ],
      },
      {
        key: 'silence-wait',
        label: 'Silence',
        parts: [
          { lit: '' },
          { opts: ['Two days', 'Since the email', 'A full week', 'Since I hit send', 'Since the message went blue', 'Longer than it should take'] },
          { lit: ' since I sent it. Still no ' },
          { opts: ["reply, and I've read it as everything by now.", "word, which is its own kind of word.", "response, and I've stopped guessing why.", "answer, though I've written a dozen in my head.", "acknowledgment, even a small one would do.", "news, good or bad, just something."] },
          { lit: ' I ' },
          { opts: ["checked read receipts more than I'll admit.", "drafted a follow-up and deleted it twice.", "told myself no news is neutral, not bad.", "kept busy specifically so I wouldn't check.", "reread what I sent, looking for a reason.", "decided silence says less about me than I think it does."] },
          { lit: ' ' },
          { opts: ["I'm still waiting on the other side of send.", "The quiet is loud, some days.", "I'll stop checking eventually. Not yet, though.", "They answered. It wasn't what the silence had prepared me for.", "Some sent messages just live in the waiting forever.", "I've made a kind of peace with unanswered."] },
        ],
      },
      {
        key: 'medical-wait',
        label: 'Medical wait',
        parts: [
          { lit: '' },
          { opts: ['Three days', 'A week and a half', 'Since Monday', 'Eleven days now', 'Since the appointment', 'Longer than they said it would take'] },
          { lit: ' since the test. Still waiting on ' },
          { opts: ["the results to say something I can live with.", "a call from a number I don't recognize yet.", "someone to tell me what the scan actually means.", "the follow-up that keeps getting pushed back.", 'a doctor to stop saying "we\'ll see."', 'permission to stop assuming the worst.'] },
          { lit: ' I ' },
          { opts: ["kept my phone on loud, even at night.", "rehearsed both versions of the news.", "went to work like it wasn't happening.", "stopped Googling, then started again.", "told fewer people than I wanted to.", "kept the appointment card where I'd see it."] },
          { lit: ' ' },
          { opts: ["I'm still waiting.", "It wasn't what I braced for, either direction.", "The waiting is its own diagnosis, some days.", "I made peace with not knowing, mostly.", "Someone else got the call I was expecting.", "I'll take the news over the not-knowing at this point."] },
        ],
      },
      {
        key: 'open-ended',
        label: 'Open-ended',
        parts: [
          { lit: 'No date. Just ' },
          { opts: ["waiting, indefinitely, for something with no calendar.", "whenever it happens, if it happens.", "a someday I've stopped trying to pin down.", "the absence of a timeline, which is its own weight.", "an answer that isn't scheduled to arrive.", "however long it takes, which nobody will say."] },
          { lit: ' I ' },
          { opts: ["asked for a timeline and got a shrug instead.", "stopped asking when, and started just living around it.", "built a life that has room for the wait in it.", "gave up trying to plan past the not-knowing.", 'learned to stop asking "how much longer."', "made the uncertainty part of the routine instead of the exception."] },
          { lit: ' ' },
          { opts: ["There's no countdown to distract me from this one.", "Open-ended is its own kind of hard.", "I've stopped expecting an end date and started expecting nothing.", "Some waits don't come with a finish line.", "I'm learning to live in it instead of just enduring it.", "Maybe today. Maybe not for years. I don't get to know."] },
        ],
      },
      {
        key: 'countdown',
        label: 'Countdown',
        parts: [
          { lit: '' },
          { opts: ['Nine days', 'Three weeks', 'One more sleep, then', 'Six days now', 'Down to the final stretch', "Fewer days than I'm ready for"] },
          { lit: ' until ' },
          { opts: ["the date I can't stop counting toward.", "whatever's on the other side of this calendar square.", "the deadline that's been circled for months.", "the day I find out if any of this worked.", "the appointment I've dreaded and wanted equally.", "the thing I can't undo once it arrives."] },
          { lit: ' I ' },
          { opts: ["crossed off the days like it would help.", "stopped counting, then started again out of habit.", "got everything ready twice, just in case.", "tried not to think about it and thought about nothing else.", "made peace with it three different times this week.", "kept moving so the waiting wouldn't catch up."] },
          { lit: ' ' },
          { opts: ["The countdown ends whether I'm ready or not.", "Fewer days left to dread it, more days left to hope.", "I'll know soon. Soon still feels far.", "Some countdowns you want to speed up and slow down at once.", "It's almost here. I still don't feel prepared.", "Time moved exactly as slow as I expected."] },
        ],
      },
      {
        key: 'recovery-wait',
        label: 'Recovery wait',
        parts: [
          { lit: '' },
          { opts: ['Three weeks', 'Since the surgery', 'A month of this', 'Since the worst of it passed', 'Since they said "give it time"', 'Longer than the estimate'] },
          { lit: ' since ' },
          { opts: ["a body that's taking its time about it.", "someone I love, slower than I'd like.", "the version of myself that isn't tired all the time.", "a wound that looks fine and doesn't feel it.", 'whatever "better" is supposed to feel like.', "something that isn't going to heal on my schedule."] },
          { lit: ' started healing. I ' },
          { opts: ["measured progress in days I could stand up straight.", 'stopped asking "how much longer," out loud at least.', "learned patience I didn't know I had.", "did the exercises even on the days I didn't believe in them.", "stayed close by, in case being close by helped.", "kept track of the good days so I wouldn't forget them."] },
          { lit: ' ' },
          { opts: ["Healing doesn't move in a straight line. Nobody warns you.", "Better, but not yet done. I'll take better.", "Some days feel like healing. Some days feel like waiting for it.", "It's slower than I wanted and faster than I feared.", "I'm learning to measure this in something other than speed.", "Still healing. Still here for it."] },
        ],
      },
      {
        key: 'second-guessing',
        label: 'Second-guessing',
        parts: [
          { lit: 'I chose this wait. Now I ' },
          { opts: ["question the choice that put me here almost daily.", "wonder if a different decision would've waited less.", "can't tell if I'm being patient or just stuck.", "replay the decision that started the waiting.", "wonder if I'd choose it again, knowing this part.", "carry the doubt right alongside the waiting itself."] },
          { lit: ' ' },
          { opts: ["Nobody made me choose this. That's the hard part.", "I can't blame the wait on anyone but the version of me that started it.", "Doubt doesn't make the waiting go faster. I've checked.", "I still think it was the right call. Some days.", "The second-guessing is its own separate wait.", "I chose this. I'm allowed to still find it hard."] },
          { lit: ' ' },
          { opts: ["I'll know if it was worth it on the other side of it.", "Some choices you have to wait years to grade fairly.", "I'm not undoing it. I'm just allowed to doubt it a little.", "The wait would exist either way. At least this one's mine.", "I chose this path knowing it would be slow. Knowing didn't help.", "I'll keep choosing it, one uncertain day at a time."] },
        ],
      },
      {
        key: 'shared-wait',
        label: 'Shared wait',
        parts: [
          { lit: "I'm not waiting alone this time. " },
          { opts: ["Someone else is watching the same phone, the same door.", "We check in on each other instead of just ourselves.", "There's a person keeping this vigil with me.", "Somebody else knows exactly what this waiting costs.", "I don't have to explain the waiting to this person.", "We take turns being the one who's still hopeful."] },
          { lit: ' ' },
          { opts: ["It doesn't go faster. It just goes less lonely.", "We've run out of new things to say about it.", "Waiting together means someone notices when I'm not okay.", "I don't know how people do this part alone.", "We've stopped pretending we're not both scared.", "Some of the weight is easier carried in two."] },
          { lit: ' ' },
          { opts: ["I'm grateful for the company, even in something this hard.", "We'll find out together, whatever it is.", "It helps to not be the only one checking the clock.", "I used to think waiting was a solitary thing. It doesn't have to be.", "Whatever happens, someone else was here for the waiting part too.", "Shared waiting is still waiting. It's just warmer."] },
        ],
      },
    ],
    live: [
      { t: "Sixth week of waiting on someone else's decision. I cleaned things that were already clean. The waiting was the whole thing.", age: 'day 4 of 9' },
      { t: 'Two hours of waiting on a scan. I walked the same block eleven times. I slept eventually.', age: 'day 2 of 9' },
    ],
  },

  resolve: {
    name: 'Resolve',
    color: COLOR.resolve,
    total: 50,
    blurb: 'Decided something, need it to hold.',
    templates: [
      {
        key: 'habit-change',
        label: 'Habit change',
        parts: [
          { lit: 'I decided to stop ' },
          { opts: ["doing the thing that made tomorrow harder to face.", "reaching for the easy version of comfort.", "letting the bad days decide what I do with my hands.", "the pattern I could see clearly in everyone but me.", "numbing instead of feeling whatever needed feeling.", "putting it off until it stopped being optional."] },
          { lit: ' It’s held for ' },
          { opts: ["nine days, which doesn't sound like much until you've tried.", "longer than any attempt before it.", "exactly as long as it's been hard, which is all of it.", "a full turn of the calendar.", "three relapses and one very stubborn restart.", "one day at a time, which is the only way it holds."] },
          { lit: ' ' },
          { opts: ["I'm not the person who fixed this in one clean try. I'm the person who kept starting over.", "It's not about being perfect. It's about the streak not mattering more than the trying.", "I'm learning that discipline is just deciding again tomorrow.", "Some days holding it is the whole accomplishment.", "The old habit still calls. I'm just not always answering.", "It counts even on the days it barely holds."] },
        ],
      },
      {
        key: 'boundary',
        label: 'Boundary',
        parts: [
          { lit: 'I decided ' },
          { opts: ["a person who's cost me more than they've given", "the version of events where I'm always the one who bends", "a habit of answering every single time I'm called", "the part of my time that used to go to guilt", "a relationship that only worked when I disappeared a little", "whatever kept letting the same thing happen twice"] },
          { lit: ' doesn’t get access anymore. It’s held for ' },
          { opts: ["longer than I thought I could manage.", "three weeks, which is a record for me.", "one uncomfortable conversation and counting.", "long enough that it's starting to feel normal.", "every single test they've thrown at it so far.", "less time than I'd like, more than I expected."] },
          { lit: ' ' },
          { opts: ["I keep waiting for the guilt to catch up with me. It hasn't yet.", "Boundaries don't feel like walls from the inside. They feel like relief.", "I'm allowed to protect something without explaining why.", "It's easier every time I don't cave.", "Nobody claps for this kind of decision. I'm clapping anyway.", "I said no. The sky didn't fall. Noted."] },
        ],
      },
      {
        key: 'truth',
        label: 'Truth',
        parts: [
          { lit: 'I decided to stop lying about ' },
          { opts: ["how I actually feel about it, even to myself.", "the parts of my life I'd been editing for everyone.", "how bad it actually got before I asked for help.", "what I actually want, instead of what's easier to say.", "who I am when nobody's managing the story.", "the thing I'd been performing being fine about."] },
          { lit: ' ' },
          { opts: ["The truth was heavier to say than the lie ever was.", "I told one person first, to see if I could survive it.", "It didn't fix everything. It just stopped adding to the pile.", "Saying it out loud made it real in a way I couldn't take back.", "Some relationships didn't survive the honesty. They were built on the lie.", "I practiced the sentence for weeks before I said it once."] },
          { lit: ' ' },
          { opts: ["I'm lighter and more exposed at the same time. Nobody tells you both happen.", "The truth cost me the version of my life built on not telling it.", "I'd rather be known and uncomfortable than hidden and safe.", "It's still hard to say. It's just no longer a lie.", "I don't know who I am without the performance yet. I'm finding out.", "Honest is harder than convenient. I chose it anyway."] },
        ],
      },
      {
        key: 'exit',
        label: 'Exit',
        parts: [
          { lit: 'I decided to leave ' },
          { opts: ["the place that stopped being good for me a while ago.", "something I'd outgrown but kept excusing.", "a role I was playing long after I stopped believing in it.", "a version of my life I'd built for someone I'm not anymore.", "the thing everyone expected me to stay in.", "a situation that only made sense from the outside."] },
          { lit: ' ' },
          { opts: ["I told them before I told myself I was sure.", "Nobody talked me out of it, though a few tried.", "I gave it one more chance first. It confirmed the decision instead of changing it.", "I said it out loud to make it real.", "It took longer to decide than it did to actually go.", "I packed slower than I expected. Some part of me wasn't ready."] },
          { lit: ' ' },
          { opts: ["I don't regret it. I regret waiting as long as I did.", "Leaving felt like failure for about a week. Then it felt like air.", "Nobody warns you how much of leaving is just grief, even when it's right.", "I'm allowed to walk away from something that no longer fits.", "The door's closed. I'm not checking if it's locked.", "It cost me things I'm still adding up. Worth it, so far."] },
        ],
      },
      {
        key: 'self-worth',
        label: 'Self-worth',
        parts: [
          { lit: 'I decided to stop shrinking for ' },
          { opts: ["rooms that were never going to make space for me anyway.", "people who liked me better smaller.", "an idea of myself I inherited instead of chose.", "the comfort of people who preferred me quiet.", "anyone who needed less of me to feel okay.", "a version of politeness that cost me the whole self."] },
          { lit: ' ' },
          { opts: ["It felt like arrogance for the first week. It wasn't.", "I practiced taking up the space I'd been apologizing for.", "Some people left when I stopped shrinking. That was information, not a loss.", "It's uncomfortable, being visible after years of not being.", "I said what I thought and didn't immediately take it back.", "It held longer than my old habit of disappearing did."] },
          { lit: ' ' },
          { opts: ["I'm allowed to be as much as I actually am.", "Nobody warned me how loud quiet confidence could feel from the inside.", "I'm not sorry for the space I take up anymore. Mostly.", "It cost me people who only loved the smaller version. Worth it.", "I keep catching myself about to apologize for existing. I stop.", "This is the resolve underneath all the other ones, probably."] },
        ],
      },
      {
        key: 'stay',
        label: 'Stay',
        parts: [
          { lit: 'I decided to stay ' },
          { opts: ["in it, when leaving would've been easier.", "and mean it this time.", "through the part that usually breaks people.", "when everyone would've understood if I hadn't.", "knowing exactly what staying would cost.", "for reasons I'm still not sure I can explain."] },
          { lit: ', despite everything. ' },
          { opts: ["It's not the easier choice. I keep choosing it anyway.", "Staying takes more than leaving does, some days.", "Nobody sees the deciding-to-stay part. It happens quietly, daily.", "I've had a dozen good reasons to change my mind. I haven't.", "It would've been simpler to go. Simple isn't always right.", "I renew the decision more often than I expected to."] },
          { lit: ' ' },
          { opts: ["I'm not staying out of fear. I checked.", "Some things are worth the harder choice. I believe that, mostly.", "Staying isn't settling if you keep choosing it on purpose.", "I'll know if this was right by how it feels in a year. For now, I'm here.", "The staying is the resolve. The rest is just showing up.", "I chose this. I'm not un-choosing it because it got hard."] },
        ],
      },
      {
        key: 'forgiveness',
        label: 'Forgiveness',
        parts: [
          { lit: 'I decided to let go of ' },
          { opts: ["something I'd been carrying long past its usefulness.", "the version of the story where I'm only the injured party.", "a grudge that had started costing me more than them.", "the need for an apology that isn't coming.", "the last word I never got to have.", "blame I'd been rehearsing for longer than it deserved."] },
          { lit: ' ' },
          { opts: ["It didn't happen all at once, whatever the decision felt like.", "I said it out loud before I fully meant it, and grew into meaning it.", "Letting go took longer than the original hurt did.", "I forgave them for me, not for them. That part matters.", "It's held, mostly, except on the anniversaries.", "I still remember. I just stopped needing them to pay for it."] },
          { lit: ' ' },
          { opts: ["Forgiving isn't the same as saying it was fine. It wasn't.", "I put the weight down. It's still on the ground if I want it back. I don't.", "Some days the old anger visits. I don't let it stay over anymore.", "I'm lighter, which was the whole point I didn't expect.", "It's not for them. I keep having to remind myself of that.", "I decided I was done paying interest on something that happened once."] },
        ],
      },
      {
        key: 'risk',
        label: 'Risk',
        parts: [
          { lit: 'I decided to finally try ' },
          { opts: ["the thing I'd been talking myself out of for years.", "it, even knowing exactly how it could go wrong.", "the version of this that scared me the most.", "something with no guarantee attached to it.", "the thing I'd only ever done in theory.", "it, out loud, where I couldn't quietly back out."] },
          { lit: ' ' },
          { opts: ["I didn't wait to feel ready, because ready wasn't coming.", "I told one person, so I couldn't pretend I hadn't decided.", "It's terrifying in a way that also feels like being alive.", "I gave myself a deadline so the fear couldn't stall it forever.", "I did the smallest possible version first, then the real one.", "Fear showed up right on schedule. I did it with it in the car anyway."] },
          { lit: ' ' },
          { opts: ["I don't know yet if it works. I know I tried.", "Whatever happens, I'm not the person who didn't.", "The trying is already more than most of my plans got.", 'I\'ll take "it didn\'t work" over "I never found out."', "Some decisions you only get to be proud of after you've made them.", "It's done now. Whatever comes next, at least it's not theoretical."] },
        ],
      },
      {
        key: 'priority-shift',
        label: 'Priority shift',
        parts: [
          { lit: 'I decided what actually matters now. ' },
          { opts: ["Everything else got quieter once I did.", "It wasn't the thing I'd been building my life around.", "The list got a lot shorter than I expected.", "Some things I thought mattered turned out to be habit, not value.", "It took losing something to see the real order of things.", "I reorganized my whole life around one clear answer."] },
          { lit: ' ' },
          { opts: ["People noticed before I said anything out loud.", "I said no to things that used to be automatic yeses.", "It cost me some relationships that only worked with the old priorities.", "I stopped apologizing for what I do with my time now.", 'The old version of "should" doesn\'t run my calendar anymore.', "It felt selfish for a while. It was actually just honest."] },
          { lit: ' ' },
          { opts: ["I know exactly what I'd protect first now, if I had to choose.", "Clarity like this doesn't come cheap. I paid for it.", "I'm not confused about what matters anymore. That's new.", "Everything I do now gets measured against the one thing that's real.", "It's a relief, knowing. Even when knowing is inconvenient.", "This is the resolve that made all my other resolves make sense."] },
        ],
      },
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
    blurb: "A good moment you don't want to lose.",
    templates: [
      {
        key: 'presence',
        label: 'Presence',
        parts: [
          { lit: '' },
          { opts: ['The light', 'An old song, unexpectedly', 'The first cold morning', 'A familiar smell', "Someone's laugh, out of nowhere", 'The particular quiet of early morning'] },
          { lit: ' on ' },
          { opts: ['an ordinary Tuesday.', "a day I almost didn't notice was passing.", 'the drive I usually spend somewhere else in my head.', 'a day that had no reason to be memorable.', 'a walk I take on autopilot.', 'a completely unscheduled afternoon.'] },
          { lit: ' I ' },
          { opts: ["stopped what I was doing to just be in it.", "didn't reach for my phone, for once.", "let myself feel it instead of naming it right away.", "stood there a beat longer than made sense.", "didn't try to hold onto it, and it stayed anyway.", "noticed, which is most of the trick."] },
          { lit: ' ' },
          { opts: ["Small. Still counts.", "I'm filing this one away for a harder day.", "Nothing happened after. That was the whole gift of it.", "I don't need it to mean more than it already did.", "That was enough, on its own, no context required.", "I almost missed it. I'm glad I didn't."] },
        ],
      },
      {
        key: 'unearned-kindness',
        label: 'Unearned kindness',
        parts: [
          { lit: '' },
          { opts: ['A stranger', 'Someone with no reason to notice me', 'Someone who owed me nothing', "A person I'll probably never see again", 'Someone having a harder week than me, somehow', 'Whoever happened to be there that day'] },
          { lit: " did something they didn't have to. " },
          { opts: ["It cost them something small and meant something large.", "I didn't know how to say thank you big enough for it.", "It wasn't dramatic. It was just decent, unprompted.", "I've thought about it more than they probably have.", "No one was watching. They did it anyway.", "I don't know their name. I remember exactly what they did."] },
          { lit: ' ' },
          { opts: ["I've been trying to pass it along since.", "It's stayed with me longer than a lot of bigger things have.", "Kindness with no angle is rarer than I want to admit.", "I want to be the version of a stranger that does that for someone else.", "It didn't fix my week. It softened it, which was enough.", "Small and unearned turned out to be exactly what I needed."] },
        ],
      },
      {
        key: 'reprieve',
        label: 'Reprieve',
        parts: [
          { lit: 'I braced for ' },
          { opts: ["the worst version of the news.", "the conversation I'd rehearsed a dozen times.", "the outcome everyone had quietly prepared me for.", "the thing I'd already started grieving.", "whatever came next being the bad kind.", "the ending I thought this story was building to."] },
          { lit: " It didn't come. " },
          { opts: ["The relief arrived before I'd even finished bracing.", "I didn't trust it at first. Good news makes me suspicious now.", "It took a full day to believe it was actually over.", "Nothing came. That nothing was the best thing that's happened in weeks.", "I cried the kind of tears that don't have a sad reason.", "I kept waiting for the catch. There wasn't one."] },
          { lit: ' ' },
          { opts: ["I'm allowed to exhale now. I keep forgetting that.", "The dread doesn't leave right away, even after the reason for it does.", "I'm learning what my body does with relief. It's not nothing.", "Whatever I saved for the bad version, I get to spend on nothing now.", "It didn't happen. I'm letting that be enough.", "Bracing for nothing is still exhausting. Worth it, this time."] },
        ],
      },
      {
        key: 'reward',
        label: 'Reward',
        parts: [
          { lit: "I'd almost given up on " },
          { opts: ["something I'd stopped letting myself want out loud.", "the thing I'd quietly stopped expecting.", "a version of good news I'd trained myself not to hope for.", "the outcome I'd already grieved not getting.", "anything going right, honestly.", 'the possibility I\'d filed under "probably not."'] },
          { lit: ' Then ' },
          { opts: ["it just showed up, unhurried, like it had been coming the whole time.", "the answer arrived smaller and quieter than I'd imagined.", "I found out sideways, from someone else, before it was official.", "it landed on an otherwise unremarkable day.", "the wait ended before the dread did.", "I read it twice to be sure it said what I thought."] },
          { lit: ' ' },
          { opts: ["I let myself want things again, a little more, after that.", "It's strange, being rewarded for something you'd stopped believing in.", "I didn't celebrate right away. I just sat with it.", "The relief arrived before the joy did, and that was fine too.", "I'm still getting used to good news landing on me.", "Earned or lucky, I'm not sorting that out today. I'm just glad."] },
        ],
      },
      {
        key: 'witnessed',
        label: 'Witnessed',
        parts: [
          { lit: '' },
          { opts: ["Someone who's known me a long time", 'A near-stranger, somehow', "Someone I didn't expect to be paying that much attention", "A person I'd assumed had stopped really looking", 'Someone who said it so plainly I almost missed it', 'Someone who saw the part I usually keep managed'] },
          { lit: ' noticed something true about me. ' },
          { opts: ["They said it like it was obvious, which made it land harder.", "I didn't know I needed to hear it until I did.", "Nobody had put it into words like that before.", "It wasn't flattery. It was just accurate, and that's rarer.", "I've turned it over in my head for days since.", "They weren't trying to give me anything. They just saw it."] },
          { lit: ' ' },
          { opts: ["Being known like that is its own kind of relief.", "I didn't realize how long I'd gone unseen until I wasn't.", "It's a strange gift, being described accurately by someone else.", "I'm keeping that sentence. I might need it later.", "Someone saw the real one, not the version I present. That matters more than I expected.", "I said thank you and meant something much bigger than the words."] },
        ],
      },
      {
        key: 'release',
        label: 'Release',
        parts: [
          { lit: 'I finally let go of ' },
          { opts: ["something I'd been holding so long I'd stopped noticing the weight.", "a tension I didn't know was still there until it wasn't.", "a version of strong that had stopped being useful.", "something I'd been carrying for someone who wasn't carrying it with me.", "a knot I'd been managing instead of undoing.", "a grief I'd been postponing on purpose."] },
          { lit: ' It came out as ' },
          { opts: ["tears that surprised me with how many there were.", "a laugh I didn't see coming.", "a kind of quiet I hadn't felt in months.", "something closer to sleep than I'd had in weeks.", "a breath I didn't know I'd been holding.", "nothing dramatic. Just lighter, all at once."] },
          { lit: ' ' },
          { opts: ["I didn't know how heavy it was until it was gone.", "I'm not fixed. I'm just not carrying that particular thing anymore.", "Some release doesn't need an audience. This one didn't have one.", "I let it happen instead of managing it, for once.", "It came back a little, the next day. Less, though.", "I'm learning that letting go isn't a single moment. This was a good one, though."] },
        ],
      },
      {
        key: 'return',
        label: 'Return',
        parts: [
          { lit: '' },
          { opts: ["Something I'd stopped expecting", 'A person I thought I’d lost track of for good', "A feeling I hadn't had in a long time", "Someone I'd made peace with never hearing from again", 'A version of myself I missed without naming it', "Something I'd quietly stopped looking for"] },
          { lit: ' came back, after ' },
          { opts: ["longer than I want to admit I was counting.", "a silence I'd decided was permanent.", "enough time that I'd built a life around its absence.", "a gap I'd stopped trying to explain to people.", "years, not the weeks I used to measure it in.", "a stretch where I genuinely didn't think it would."] },
          { lit: ' ' },
          { opts: ["I didn't know how much room I'd made for its absence until it wasn't absent anymore.", "I'm careful with it now, the way you're careful with something you almost lost.", "It came back different, and so had I. We're figuring out the new shape.", "I don't take it for granted the second time.", "Some things you only fully appreciate after the gap.", "I let myself believe it was really back, eventually."] },
        ],
      },
      {
        key: 'alignment',
        label: 'Alignment',
        parts: [
          { lit: '' },
          { opts: ['The exact right person', 'A small piece of luck', 'One thing going easily, for once', 'A message that arrived at precisely the right moment', 'A coincidence too specific to just be one', 'The one thing on the list that actually worked out'] },
          { lit: ' happened right when I needed it. ' },
          { opts: ["I don't believe in signs, usually. This one made me reconsider.", "The timing was so precise it felt like someone was paying attention.", "It could've landed any other day and meant so much less.", "I noticed the timing before I noticed the thing itself.", "I've stopped trying to explain why it worked out that way.", "It arrived exactly when I'd run out of other options."] },
          { lit: ' ' },
          { opts: ["I don't need it to mean something cosmic. It helped either way.", "Coincidence or not, I'll take it.", "I'm choosing to call that lucky and not examine it too hard.", "Some days the universe seems to be paying better attention than others.", "I said thank you to no one in particular, just in case.", "It didn't fix everything. It fixed the one thing I needed that day."] },
        ],
      },
      {
        key: 'quiet-after',
        label: 'Quiet after',
        parts: [
          { lit: "It wasn't until " },
          { opts: ['the worst of it', 'the hard part', 'the emergency', 'the waiting', 'the crisis everyone had been bracing for', "the version of the year I don't want to repeat"] },
          { lit: ' was over that I noticed ' },
          { opts: ["how much good had happened quietly around the edges of it.", "the small kindnesses I hadn't had room to register at the time.", "that I was still, somehow, okay.", "how many people had shown up without making it a thing.", "that the good moments had been there the whole time, just crowded out.", "how much I'd been carried without noticing who was carrying me."] },
          { lit: ' ' },
          { opts: ["The grace was there the whole time. I just couldn't see it until I stopped bracing.", "I owe some people a thank you I didn't have room to give in the moment.", "Hindsight found the good parts the present was too busy to notice.", "I'm going back through it now, on purpose, looking for what I missed.", "It's strange, grieving and grateful in the same season.", "I noticed, finally. Late is still on time for gratitude."] },
        ],
      },
    ],
    live: [
      { t: 'The smell of rain on the worst week. I stopped walking. I’d have missed it a year ago.', age: 'unbounded' },
      { t: 'A bus arriving on an ordinary Tuesday. I took the long way. That was the whole day.', age: 'unbounded' },
    ],
  },
};

// Starting occupied-slot count per kindling — one real example message each,
// so the fire opens with exactly 5 embers. Everything beyond this is real:
// every further drop is a real person, growing both `used` and the fire
// together, with no separate cap layered on top.
export const INITIAL_USED = { disgrace: 1, ruin: 1, vigil: 1, resolve: 1, grace: 1 };

export function totalFor(id) {
  return KINDLING[id].total;
}
