-- Seeds the three initiatives already referenced by the static frontend
-- (frontend/lib/content.ts) plus one field-update story per initiative, so
-- the API and the public site describe the same real programs. Numbers here
-- are stated as targets/goals, never as completed impact, consistent with
-- AKSSADA's actual 3-year goals.

INSERT INTO initiative (title, slug, focus_area, summary, content, is_published)
VALUES
(
    'Beekeeping & Sustainable Livelihoods',
    'beekeeping-sustainable-livelihoods',
    'Sustainable Livelihoods',
    'Pilot beekeeping projects designed with women''s groups, built as a repeatable model for forest-based income.',
    'AKSSADA is piloting beekeeping as a forest-based livelihood for women''s groups in Siddi and other forest-dwelling communities in Karnataka. Beekeeping was chosen because it requires modest upfront investment, works alongside existing agricultural and forest livelihoods, and directly rewards keeping the surrounding forest healthy — better forage means better honey yields.

The pilot phase focuses on three women''s groups: providing starter hives and basic equipment, hands-on training in hive management and seasonal care, and support connecting to local and regional honey markets. AKSSADA''s three-year goal is to grow this into three pilot beekeeping projects for women''s groups, with a model that other villages can adopt without needing to start from scratch.

This initiative sits within AKSSADA''s broader Sustainable Livelihoods focus area, alongside medicinal plant nurseries, eco-tourism, and animal husbandry work.',
    true
),
(
    'Medicinal Plant Nurseries',
    'medicinal-plant-nurseries',
    'Sustainable Livelihoods',
    'Nurseries to grow and distribute medicinal plant saplings, supporting both income and traditional knowledge.',
    'Forest-dwelling communities in Karnataka hold generations of knowledge about medicinal plants native to the region. AKSSADA''s medicinal plant nursery initiative is planned to turn that knowledge into a sustainable source of income, by establishing community-run nurseries that propagate and distribute medicinal plant saplings.

The planned approach pairs elders who hold traditional plant knowledge with younger community members learning nursery management, so the knowledge transfer happens alongside the livelihood-building. Saplings raised in the nurseries are intended for both replanting in degraded forest areas and sale to interested buyers, giving the initiative both an environmental and an income dimension.

AKSSADA''s three-year target for this initiative is 10,000 medicinal plant saplings. As with all AKSSADA initiatives, this figure is a goal the organization is working toward, not a count of saplings already distributed.',
    true
),
(
    'Youth & Community Development',
    'youth-community-development',
    'Youth Leadership',
    'Sports and leadership programs that connect young people in forest-dwelling communities to wider opportunity.',
    'AKSSADA sees youth leadership as a distinct focus area because opportunities for young people in Siddi and other forest-dwelling communities are often limited by distance from urban centers rather than by ability. Sports and structured leadership programs are being used as an entry point to build confidence, teamwork, and a path toward state and national-level participation.

The initiative is intended to combine regular sports coaching and facilities support with mentorship and leadership training for older youth, so that the program produces both athletes and young community organizers. AKSSADA views this as a long-term, ongoing focus area rather than a single fixed-length project.

Youth leadership work is closely connected to AKSSADA''s cultural heritage efforts, since many of the young people involved are also the next generation of custodians for traditions like Dhamal dance and Kawandi quilting.',
    true
);

INSERT INTO story (title, slug, content, author_name, category, initiative_id, is_published, published_at)
VALUES
(
    'Why We Started with Beekeeping',
    'why-we-started-with-beekeeping',
    'When AKSSADA''s team began talking with women''s groups about livelihood options, beekeeping came up again and again — not because it was unfamiliar, but because a few families already kept hives informally and knew it worked with, rather than against, the forest around them.

The pilot design leans on that existing knowledge. Rather than introducing an entirely new skill, AKSSADA''s role has been to formalize training, provide starter equipment, and help connect participating groups to buyers who pay a fair price for forest honey. It is deliberately a small, repeatable model: prove it works for a handful of groups first, document what changes between villages, and only then look at scaling it further.

There is no shortcut here — beekeeping has a learning curve, and yields depend on a healthy surrounding forest, which is itself something AKSSADA''s environmental programs are working to protect. The two efforts are meant to reinforce each other over time.',
    'AKSSADA Team',
    'Sustainable Livelihoods',
    (SELECT id FROM initiative WHERE slug = 'beekeeping-sustainable-livelihoods'),
    true,
    now() - interval '14 days'
),
(
    'Planning the First Medicinal Plant Nursery',
    'planning-the-first-medicinal-plant-nursery',
    'Before a single sapling is planted, AKSSADA''s medicinal plant nursery initiative starts with conversations — sitting with community elders to document which plants are used for what, where they traditionally grow, and which species are becoming harder to find in the wild.

That knowledge shapes the nursery plan directly. Species are prioritized both for their traditional medicinal use and for how well suited they are to community-run propagation, so that the nursery can realistically supply saplings for both replanting degraded forest patches and sale to outside buyers.

This is still early-stage: site selection and elder consultations are underway ahead of the first nursery going into operation. AKSSADA is treating the first nursery as a template — the goal is a model that other villages can replicate with their own local plant knowledge, not a single centralized operation.',
    'AKSSADA Team',
    'Sustainable Livelihoods',
    (SELECT id FROM initiative WHERE slug = 'medicinal-plant-nurseries'),
    true,
    now() - interval '7 days'
),
(
    'Building a Youth Sports Program from the Ground Up',
    'building-a-youth-sports-program-from-the-ground-up',
    'Access, more than interest, has been the biggest barrier for young athletes in the forest-dwelling communities AKSSADA works with. Talent is not scarce; consistent coaching, equipment, and a path to competitive opportunities are.

AKSSADA''s youth and community development work starts by addressing that access gap directly — organizing regular practice sessions, sourcing basic sports equipment, and identifying which young people are ready for more structured coaching or competition. Older participants are also being brought in as informal mentors for younger ones, which is the beginning of the leadership-training side of the program.

The intent is for this to grow into something ongoing rather than a one-off event: a program young people can stay involved with as they get older, whether that means competing, coaching, or eventually helping run it themselves.',
    'AKSSADA Team',
    'Youth Leadership',
    (SELECT id FROM initiative WHERE slug = 'youth-community-development'),
    true,
    now() - interval '2 days'
);
