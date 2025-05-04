const ShakespeareWork = {
    "A Midsummer Night's Dream": "midsummer",
    "All's Well That Ends Well": "allWell",
    "Antony and Cleopatra": "cleopatra",
    "As You Like It": "asYouLikeIt",
    "Coriolanus": "coriolanus",
    "Cymbeline": "cymbeline",
    "Hamlet": "hamlet",
    "Henry IV, Part I": "henryIV_1",
    "Henry IV, Part 2": "henryIV_2",
    "Henry V": "henryV",
    "Henry VI, Part 1": "henryVI_1",
    "Henry VI, Part 2": "henryVI_2",
    "Henry VI, Part 3": "henryVI_3",
    "Henry VIII": "henryVIII",
    "Julius Caesar": "caesar",
    "King John": "john",
    "King Lear": "lear",
    "Love's Labor's Lost": "loveLabor",
    "Lucrece": "lucrece",
    "Macbeth": "macbeth",
    "Measure for Measure": "measure",
    "Much Ado About Nothing": "muchAdo",
    "Othello": "othello",
    "Pericles, Prince of Tyre": "pericles",
    "Richard II": "richardII",
    "Richard III": "richardIII",
    "Romeo and Juliet": "romeo",
    "Sonnets": "sonnets",
    "The Comedy of Errors": "comedyOfErrors",
    "The Merchant of Venice": "merchantOfVenice",
    "The Merry Wives of Windsor": "merryWives",
    "The Phoenix and Turtle": "phoenix",
    "The Taming of the Shrew": "taming",
    "The Tempest": "tempest",
    "The Two Gentlemen of Verona": "twoGentlemen",
    "The Two Noble Kinsmen": "twoKinsmen",
    "The Winter's Tale": "wintersTale",
    "Timon of Athens": "timon",
    "Titus Andronicus": "titus",
    "Troilus and Cressida": "troilus",
    "Twelfth Night": "twelfthNight",
    "Venus and Adonis": "venus"
} as const;

type ShakespeareWorkTitleType = keyof typeof ShakespeareWork;
type ShakespeareWorkCodeType = typeof ShakespeareWork[ShakespeareWorkTitleType];

const getShakespeareWorkCode
    = (title: string): ShakespeareWorkCodeType | undefined => {
    if (title in ShakespeareWork) {
        return ShakespeareWork[title as ShakespeareWorkTitleType]
    }
    return undefined;
};

export default getShakespeareWorkCode;
