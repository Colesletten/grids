/* The thirty plates, in the order of the book.
   Principles are summarised in our own words; each carries one short line of Vignelli's. */

export type PlateInfo = {
  id: string;
  part: 1 | 2;
  title: string;
  principle: string[];
  quote: string;
  proof: string;
};

export const PLATES: PlateInfo[] = [
  {
    id: 'semantics',
    part: 1,
    title: 'Semantics',
    principle: [
      'Before anything is drawn, search for the meaning of the thing to be designed: its history, its sender, its receiver, its use.',
      'From that search comes a design in which nothing is arbitrary. Every detail carries the meaning or serves a precise purpose. Stripes and swashes splashed on for no reason are visual pollution.',
    ],
    quote: 'Design without semantics is shallow and meaningless.',
    proof: 'What remains is only what the subject needs in order to be understood. Nothing on the sheet is there for its own sake.',
  },
  {
    id: 'syntactics',
    part: 1,
    title: 'Syntactics',
    principle: [
      'Syntax is the grammar of design: the structure, the grid, the typefaces, the way headlines, text and pictures relate to one another and to the whole.',
      'Consistency comes from keeping those relationships the same from page to page. One element out of system is enough to break the sentence.',
    ],
    quote: 'God is in the details.',
    proof: 'The flaw was never the element itself, only its relationship to the others. Syntax is that relationship, held constant.',
  },
  {
    id: 'pragmatics',
    part: 1,
    title: 'Pragmatics',
    principle: [
      'A design that is right in meaning and consistent in structure is still wasted effort if nobody understands it. It should stand by itself, without explanation.',
      'Clarity of intent becomes clarity of result. Complexity is welcome; complication is the mark of a confused mind.',
    ],
    quote: 'We love complexities but hate complications!',
    proof: 'Both boards hold exactly the same information. Only one of them lets you use it.',
  },
  {
    id: 'discipline',
    part: 1,
    title: 'Discipline',
    principle: [
      'The result is the sum of all its details, so there is no room for sloppiness. Quality is either there or it is not.',
      'Discipline is a set of self-imposed rules, and also an attitude: the control that gives work continuity of intent from beginning to end.',
    ],
    quote: 'Design without discipline is anarchy.',
    proof: 'A pixel is a detail, and the page is the sum of its details. The eye feels the error long before it can name it.',
  },
  {
    id: 'appropriateness',
    part: 1,
    title: 'Appropriateness',
    principle: [
      'Searching for the roots of a problem also defines the range of solutions that belong to it. Appropriateness is the search for what is specific to this problem and no other.',
      'It points to the right medium, material, scale, expression and colour. It is above style: there are many ways to solve a problem, but the answer has to fit.',
    ],
    quote: 'Listen to what a thing wants to be.',
    proof: 'None of the rejected answers was ugly. Each was simply an answer to a different question.',
  },
  {
    id: 'ambiguity',
    part: 1,
    title: 'Ambiguity',
    principle: [
      'Ambiguity here is not vagueness. It is plurality of meaning: one form that can be read in more than one way, each reading enriching the other.',
      'It deepens a design when measured and sinks it when not. Contradiction can reinforce it, but more often signals a loss of control.',
    ],
    quote: 'Great caution is recommended in using these spices.',
    proof: 'One disc, read as sun and as moon, says both words of the title at once. Add more and the readings cancel one another.',
  },
  {
    id: 'design-is-one',
    part: 1,
    title: 'Design is One',
    principle: [
      'Design is not a collection of specialities, and it is not a style. It is one discipline, a creative process with its own rules, applicable to anything from the spoon to the city.',
      'Master the discipline and the subject can change freely: glass, metal, print, furniture, interiors.',
    ],
    quote: 'Design is one - it is not many different ones.',
    proof: 'A cup, a lamp, a page and a sign have nothing in common except the mind that ordered them. That is the whole point.',
  },
  {
    id: 'visual-power',
    part: 1,
    title: 'Visual Power',
    principle: [
      'Good design is forceful. In print, a difference of scale on the same page, or bold type against light, gives strong and dynamic impressions.',
      'Power is an expression of intellectual elegance and can be achieved delicately. It must not be confused with mere impact, which is usually vulgarity and obtrusiveness.',
    ],
    quote: 'We do not like limpy design.',
    proof: 'One element raised far above the rest gives power. Everything raised a little gives only noise.',
  },
  {
    id: 'intellectual-elegance',
    part: 1,
    title: 'Intellectual Elegance',
    principle: [
      'Not the elegance of manners, but of the mind: the level of intelligence behind every masterpiece, the thread that leads to the best solution, beyond compromise.',
      'It is the opposite of vulgarity, and it is not a style. It is a sense of decency and responsibility in how design is conceived.',
    ],
    quote: 'It elevates the most humble artifact to a noble stand.',
    proof: 'Elegance of the mind is not softness or luxury. A receipt and a warning sign can have it; a gilded invitation can lack it.',
  },
  {
    id: 'timelessness',
    part: 1,
    title: 'Timelessness',
    principle: [
      'Against fashion, obsolescence and novelty for its own sake. For design that lasts and respects the people who pay for it and live with it.',
      'Primary shapes and primary colours have formal values that do not date. So does typography that looks for objectivity, and economy that avoids waste.',
    ],
    quote: 'We like Design that is clear, simple and enduring.',
    proof: 'Whatever carried a date in its styling has already expired. The primary forms were never in fashion, so they cannot go out of it.',
  },
  {
    id: 'responsibility',
    part: 1,
    title: 'Responsibility',
    principle: [
      'Responsibility is economic awareness: finding the solution that is appropriate in cost as well as form, not one that flatters the ego of designer or client.',
      'It has three levels. To ourselves, for the integrity of the work. To the client, for a sound and efficient answer. To the public, who must use the result.',
    ],
    quote: 'A design should stand by itself, without excuses, explanations, apologies.',
    proof: 'Each right answer served the work, the client and the public together. An answer that serves only one of them is not yet a solution.',
  },
  {
    id: 'equity',
    part: 1,
    title: 'Equity',
    principle: [
      'A logo that has lived in public for decades belongs to the collective culture. It is a landmark with accumulated meaning, and there is no reason to throw it away for a new concoction, however well drawn.',
      'Change for the sake of change is the wrong motive. A light retouch can prepare an old mark for contemporary use while keeping everything people recognise.',
    ],
    quote: 'What is new is NOT a graphic form but a way of thinking.',
    proof: 'A light retouch tightens what age had loosened and keeps what seventy years made familiar. Past that point each step spends equity and buys nothing.',
  },
  {
    id: 'paper-sizes',
    part: 2,
    title: 'Paper Sizes',
    principle: [
      'The international A series starts from one sheet and halves it again and again, every size keeping the same proportion. A4, 210 by 297 mm, is the basic sheet for stationery, and about two thirds of it is a square.',
      'Standard sizes save paper, money and trees. Choosing a format is an ethical decision as well as an aesthetic one.',
    ],
    quote: 'The repercussion of ugliness is endless.',
    proof: 'Four halvings of A0 give A4, and every sheet on the way has the same proportion. Nothing is trimmed away and nothing is arbitrary.',
  },
  {
    id: 'grids',
    part: 2,
    title: 'Grids, Margins, Columns and Modules',
    principle: [
      'Graphic design is the organisation of information, and the grid is its basic structure: outside margins, then columns, then modules from top to bottom.',
      'There are infinite grids but only one most appropriate for the job. Too fine a grid is the same as none; too coarse a grid offers too few alternatives.',
    ],
    quote: 'The grid is a useful tool, rather than a constricting device.',
    proof: 'The right grid is the one whose module is sized to the content: enough alternatives to place everything, few enough to keep order.',
  },
  {
    id: 'letterhead',
    part: 2,
    title: 'A Company Letterhead',
    principle: [
      'Margins of ten millimetres, then three columns and six modules. The first column stays empty, save for a symbol placed just below the first fold. The asymmetry gives the sheet its modernity.',
      'The company name heads the second column. The addressee sits in the second module, the letter begins at the third and runs to the right margin, and the sender’s address closes the page across columns two and three.',
    ],
    quote: 'Five lines and seven notes allow one to make infinite compositions.',
    proof: 'Every component has its place on the same grid, with its proper hierarchy. The typed letter completes the design.',
  },
  {
    id: 'grids-for-books',
    part: 2,
    title: 'Grids for Books',
    principle: [
      'The content determines the container. A book of square pictures is square; a book of oblong pictures is oblong. The grid follows the proportion of most of the pictures, so that they need the least cropping.',
      'A refinement: choose the leading so that lines of type and picture modules coincide exactly, with gutters about one line of type wide.',
    ],
    quote: 'The content determines the container.',
    proof: 'Format, module and leading all came from the material itself. The book has integrity because nothing in it was imposed from outside.',
  },
  {
    id: 'typefaces',
    part: 2,
    title: 'Typefaces: The Basic Ones',
    principle: [
      'Out of thousands of typefaces a few basic ones are enough: Garamond, Bodoni, Century Expanded, Futura, Times Roman, Helvetica. With them almost anything can be set, and set better.',
      'It is not the type that counts but what is done with it: structure, space, weight and alignment. Type is there to organise information objectively, not to act out the words.',
    ],
    quote: 'I don’t believe that when you write dog the type should bark!',
    proof: 'Six faces, spanning four centuries, kept. The specimens here are set in open-licence relatives of the originals.',
  },
  {
    id: 'alignment',
    part: 2,
    title: 'Flush Left, Centered, Justified',
    principle: [
      'Flush left is the rule: the eye returns to a fixed edge and words need not be broken. Its ragged side still has to be shaped, line by line.',
      'Centered is for lapidary text, invitations, the address at the foot of a letterhead, business cards. Justified belongs to text books and is not a favourite, because it is forced.',
    ],
    quote: 'It is fundamentally contrived.',
    proof: 'Alignment is chosen by the kind of reading, not by taste. Most of the time that means flush left, with a rag that has been looked after.',
  },
  {
    id: 'type-size',
    part: 2,
    title: 'Type Size Relationships',
    principle: [
      'Size follows the width of the column. Up to 70 mm: 8 on 9, 9 on 10 or 10 on 11 point. Up to 140 mm: 12 on 13 or 14 on 16. Wider still: 16 on 18 or 18 on 20.',
      'Keep to two sizes on a page, the larger usually twice the smaller. Heads and subheads take the text size in bold. Type is never deformed.',
    ],
    quote: 'We are horrified by any type deformation.',
    proof: 'A line should hold a comfortable number of words. Narrow columns want small type, wide columns large, with leading to match.',
  },
  {
    id: 'rulers',
    part: 2,
    title: 'Rulers',
    principle: [
      'Rules are given a hierarchy of weights. In a form, heavy rules of two points separate the major parts; light rules of half a point or one point separate the items within each part.',
      'Type between rules is small and always set close to the rule above. It hangs from the ruler.',
    ],
    quote: 'Type should always hang from the ruler.',
    proof: 'Two weights are enough to show the structure of the whole form at a glance, and hanging type ties each entry to its own rule.',
  },
  {
    id: 'contrast',
    part: 2,
    title: 'Contrasting Type Sizes',
    principle: [
      'The play between a very large headline and much smaller text, with white space between them, is among the most exciting things in typography.',
      'Stay with one or two sizes. Use weight for a function, never to make the message louder. Those who shout enlarge everything; in a world of screaming, silence is noticed.',
    ],
    quote: 'It is really the white that makes the black sing.',
    proof: 'Two sizes, far apart, and bold for function only. The subhead needs no size of its own.',
  },
  {
    id: 'scale',
    part: 2,
    title: 'Scale',
    principle: [
      'Scale is the most appropriate size of a thing in its natural context. It can be right or wrong, and it applies to everything: size, thickness, weight, material.',
      'It can also be broken on purpose to give an object power and life, but only with full awareness of what scale means.',
    ],
    quote: 'Manipulation of scale implies knowledge and full awareness of the meaning of scale.',
    proof: 'A little too large is an error. Many times too large is a statement. The difference is knowing which one you are making.',
  },
  {
    id: 'texture',
    part: 2,
    title: 'Texture',
    principle: [
      'Light is the master of form and texture. A polished surface reflects light, a dull one absorbs it, an etched or engraved one traps it. This is true of glass, silver and paper alike.',
      'Finishes carry connotations from rich to poor, from opulent to restrained. Choosing them is how an object expresses what it is.',
    ],
    quote: 'Light is the master of form and texture.',
    proof: 'Reflect, absorb, trap: three behaviours of light, and with them a range of expression from opulent to restrained.',
  },
  {
    id: 'color',
    part: 2,
    title: 'Color',
    principle: [
      'Colour is used mostly as a signifier or identifier, not pictorially. Hence a preference for a primary palette of red, blue and yellow.',
      'The palette is limited, like the typefaces, so that the message stays clear. Any colour may be right for a task; appropriateness decides.',
    ],
    quote: 'The right color at the right time.',
    proof: 'One line, one colour, from end to end, and no two that could be mistaken for each other. The colour is the name of the line.',
  },
  {
    id: 'layouts',
    part: 2,
    title: 'Layouts',
    principle: [
      'Sift the images and keep the one with the quality of an icon. Set narrow outside margins, then columns and modules to suit the material.',
      'The grid gives consistency; the excitement comes from the elements. Above all manage the white space: a bad layout leaves no room to breathe.',
    ],
    quote: 'It is the white space that makes the layout sing.',
    proof: 'One image chosen for its force, text hanging from a single line, a caption beside its picture, and the rest left white.',
  },
  {
    id: 'sequence',
    part: 2,
    title: 'Sequence',
    principle: [
      'A publication is a cinematic object: each spread is a still, and turning the pages is the film. The sequence of layouts matters as much as any one of them.',
      'The favoured rhythm is simple: a page of text beside a full-bleed picture, then a picture across the whole spread, then a full-bleed picture facing a white page with one small picture.',
    ],
    quote: 'If you see the layout, it is probably a bad layout!',
    proof: 'Text and picture, picture alone, picture and silence. A simple format, articulated so that it never repeats itself.',
  },
  {
    id: 'binding',
    part: 2,
    title: 'Binding',
    principle: [
      'A square spine looks sharper than a round one. The headband is best plain white. A cover laminated with paper needs smooth calendered board; under cloth or leather, chipboard will do.',
      'The sandwich binding: two bare boards glued to the endpapers, a cloth spine with the title stamped on it. The book opens flat, so a picture can run across the spread.',
    ],
    quote: 'Two gray boards holding a stack of white pages.',
    proof: 'Each choice is the plainest one that does the job, and the binding as a whole exists so that the book can open flat.',
  },
  {
    id: 'identity',
    part: 2,
    title: 'Identity and Diversity',
    principle: [
      'Too much identity produces redundancy: nothing is retained because everything is the same. Too much diversity produces fragmentation.',
      'A strong programme keeps its basic identifiers constant and leaves room to play. In a book series the system holds while the illustration changes from cover to cover.',
    ],
    quote: 'An essential contraposition to bring life to design.',
    proof: 'The band, the type and the position never move; shape and colour do. Each cover is new and none could belong to another series.',
  },
  {
    id: 'white-space',
    part: 2,
    title: 'White Space',
    principle: [
      'White space is to the page what space is to architecture. It separates the parts of a message, establishes their hierarchy and places them on the page.',
      'Tight margins create tension; wide margins bring serenity. Tight setting turns words into lines and loose setting turns them into dots.',
    ],
    quote: 'Such is indeed the power of the white space.',
    proof: 'Nothing was added or removed in any of the three. Only the space moved, and the expression of the page changed with it.',
  },
  {
    id: 'experiences',
    part: 2,
    title: 'A Collection of Experiences',
    principle: [
      'Modular and standard dimensions are economical in cost and in meaning. Parts of an object relate as single to double, one to three, a half or a third, never by an odd, casual size.',
      'Economy is the essence of design: the leanest appropriate solution. A lifetime of sifting such choices builds a personal canon.',
    ],
    quote: 'Good design doesn’t cost more than bad design.',
    proof: 'A half, a third, a double. The eye recognises a simple relationship at once and is uneasy with everything in between.',
  },
];

export const byId = (id: string) => PLATES.find((p) => p.id === id);
export const indexOf = (id: string) => PLATES.findIndex((p) => p.id === id);
export const num = (i: number) => String(i + 1).padStart(2, '0');
