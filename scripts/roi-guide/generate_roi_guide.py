"""Generate the Six1Five Studio "Reality Capture ROI Guide" PDF.

Output: client/public/downloads/six1five-reality-capture-roi-guide.pdf
(served at /downloads/six1five-reality-capture-roi-guide.pdf)

Run from the repo root:
    python3 scripts/roi-guide/generate_roi_guide.py

Requires: reportlab (pip install reportlab)

Edit the text in this file and re-run to update the guide. Keep every claim
true to what Six1Five Studio delivers today, and keep example figures
clearly labelled as examples.
"""

from __future__ import annotations

from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

# ---------------------------------------------------------------------------
# Paths and brand
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parents[2]
OUTPUT = REPO_ROOT / "client" / "public" / "downloads" / "six1five-reality-capture-roi-guide.pdf"

ORANGE = colors.HexColor("#F97316")  # --tech-orange
BLUE = colors.HexColor("#0EA5E9")  # --primary-blue
NAVY = colors.HexColor("#1E293B")
DARK = colors.HexColor("#22252B")  # hsl(218,11%,15%)
INK = colors.HexColor("#1F2937")
MUTED = colors.HexColor("#6B7280")
LIGHT = colors.HexColor("#F3F4F6")
RULE = colors.HexColor("#D1D5DB")

SITE = "six1fivestudio.com"
CONTACT_URL = "https://six1fivestudio.com/#contact"
EDITION = "2026 edition"

# ---------------------------------------------------------------------------
# Styles
# ---------------------------------------------------------------------------

base = getSampleStyleSheet()

BODY = ParagraphStyle(
    "Body", parent=base["BodyText"], fontName="Helvetica", fontSize=10,
    leading=14, textColor=INK, spaceAfter=7,
)
SMALL = ParagraphStyle("Small", parent=BODY, fontSize=8.5, leading=11.5, textColor=MUTED)
H1 = ParagraphStyle(
    "H1", parent=BODY, fontName="Helvetica-Bold", fontSize=20, leading=25,
    textColor=NAVY, spaceBefore=4, spaceAfter=10,
)
H2 = ParagraphStyle(
    "H2", parent=BODY, fontName="Helvetica-Bold", fontSize=13, leading=17,
    textColor=ORANGE, spaceBefore=10, spaceAfter=5,
)
H3 = ParagraphStyle(
    "H3", parent=BODY, fontName="Helvetica-Bold", fontSize=10.5, leading=14,
    textColor=NAVY, spaceBefore=4, spaceAfter=3,
)
BULLET = ParagraphStyle("Bullet", parent=BODY, leftIndent=14, bulletIndent=2, spaceAfter=4)
CELL = ParagraphStyle("Cell", parent=BODY, fontSize=9, leading=11.5, spaceAfter=0)
HINT = ParagraphStyle("Hint", parent=CELL, fontSize=8, leading=10, textColor=MUTED)
CELL_B = ParagraphStyle("CellB", parent=CELL, fontName="Helvetica-Bold")
CALLOUT = ParagraphStyle("Callout", parent=BODY, fontSize=10, leading=14, spaceAfter=0)


def p(text: str, style: ParagraphStyle = BODY) -> Paragraph:
    return Paragraph(text, style)


def bullets(items: list[str]) -> list[Paragraph]:
    return [Paragraph(item, BULLET, bulletText="•") for item in items]


def callout(title: str, text: str, color: colors.Color = BLUE) -> Table:
    """A shaded box with a coloured left bar, used for notes and warnings."""
    inner = [p(f"<b>{title}</b>", CALLOUT), p(text, CALLOUT)]
    t = Table([[inner]], colWidths=[6.5 * inch])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), LIGHT),
        ("LINEBEFORE", (0, 0), (0, -1), 4, color),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 9),
    ]))
    return t


def grid(rows: list[list], col_widths: list[float], header: bool = True) -> Table:
    data = [[c if isinstance(c, Flowable) else p(str(c), CELL) for c in row] for row in rows]
    t = Table(data, colWidths=col_widths, repeatRows=1 if header else 0)
    style = [
        ("GRID", (0, 0), (-1, -1), 0.5, RULE),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]
    if header:
        style += [("BACKGROUND", (0, 0), (-1, 0), NAVY)]
    t.setStyle(TableStyle(style))
    return t


def head(*labels: str) -> list[Paragraph]:
    white = ParagraphStyle("HeadCell", parent=CELL_B, textColor=colors.white)
    return [p(label, white) for label in labels]


class FillField(Flowable):
    """A fillable PDF text box, so the worksheet can be typed into."""

    def __init__(self, name: str, width: float = 1.3 * inch, height: float = 16) -> None:
        super().__init__()
        self.name = name
        self.width = width
        self.height = height

    def wrap(self, avail_width: float, avail_height: float) -> tuple[float, float]:
        return self.width, self.height

    def draw(self) -> None:
        self.canv.acroForm.textfield(
            name=self.name, tooltip=self.name, x=0, y=0, width=self.width,
            height=self.height, borderStyle="underlined", borderColor=MUTED,
            fillColor=colors.white, textColor=INK, fontName="Helvetica",
            fontSize=9, relative=True,
        )


class CheckBox(Flowable):
    """An empty square to tick on a printed checklist."""

    size = 9

    def wrap(self, avail_width: float, avail_height: float) -> tuple[float, float]:
        return self.size, self.size + 3

    def draw(self) -> None:
        self.canv.setStrokeColor(NAVY)
        self.canv.setLineWidth(0.8)
        self.canv.rect(0, 0, self.size, self.size, stroke=1, fill=0)


# ---------------------------------------------------------------------------
# Page decoration
# ---------------------------------------------------------------------------

def draw_cover(canvas, doc) -> None:
    w, h = LETTER
    canvas.saveState()
    canvas.setFillColor(DARK)
    canvas.rect(0, 0, w, h, stroke=0, fill=1)
    canvas.setFillColor(ORANGE)
    canvas.rect(0, h - 0.35 * inch, w, 0.35 * inch, stroke=0, fill=1)
    canvas.setFillColor(BLUE)
    canvas.rect(0, 0, w, 0.18 * inch, stroke=0, fill=1)

    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 15)
    canvas.drawString(0.9 * inch, h - 1.2 * inch, "SIX1FIVE STUDIO")
    canvas.setFillColor(colors.HexColor("#9CA3AF"))
    canvas.setFont("Helvetica", 10.5)
    canvas.drawString(0.9 * inch, h - 1.45 * inch, "Drone mapping and reality capture  |  Smyrna, Tennessee")

    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 34)
    canvas.drawString(0.9 * inch, h - 3.4 * inch, "Is Drone Mapping")
    canvas.drawString(0.9 * inch, h - 3.95 * inch, "Worth It for")
    canvas.setFillColor(ORANGE)
    canvas.drawString(0.9 * inch, h - 4.5 * inch, "Your Project?")

    canvas.setFillColor(colors.HexColor("#E5E7EB"))
    canvas.setFont("Helvetica", 14)
    canvas.drawString(0.9 * inch, h - 5.15 * inch, "A practical ROI guide and worksheet for builders,")
    canvas.drawString(0.9 * inch, h - 5.42 * inch, "developers and land sellers in Middle Tennessee")

    canvas.setStrokeColor(BLUE)
    canvas.setLineWidth(2)
    canvas.line(0.9 * inch, h - 5.85 * inch, 2.4 * inch, h - 5.85 * inch)

    canvas.setFillColor(colors.HexColor("#D1D5DB"))
    canvas.setFont("Helvetica", 11)
    lines = [
        "Inside:",
        "1.  What you actually get from a drone capture",
        "2.  Five places it saves money or time",
        "3.  A fill-in ROI worksheet with worked examples",
        "4.  When it is NOT worth it",
        "5.  Ten questions to ask any drone provider",
        "6.  A pre-flight planning checklist",
    ]
    y = h - 6.4 * inch
    for line in lines:
        canvas.drawString(0.9 * inch, y, line)
        y -= 0.27 * inch

    canvas.setFillColor(colors.HexColor("#9CA3AF"))
    canvas.setFont("Helvetica", 9.5)
    canvas.drawString(0.9 * inch, 0.6 * inch, f"{SITE}   |   {EDITION}")
    canvas.restoreState()


def draw_page(canvas, doc) -> None:
    w, h = LETTER
    canvas.saveState()
    canvas.setFillColor(ORANGE)
    canvas.rect(0, h - 0.12 * inch, w, 0.12 * inch, stroke=0, fill=1)
    canvas.setFont("Helvetica-Bold", 8.5)
    canvas.setFillColor(NAVY)
    canvas.drawString(1 * inch, h - 0.55 * inch, "SIX1FIVE STUDIO")
    canvas.setFont("Helvetica", 8.5)
    canvas.setFillColor(MUTED)
    canvas.drawRightString(w - 1 * inch, h - 0.55 * inch, "Reality Capture ROI Guide")
    canvas.setStrokeColor(RULE)
    canvas.setLineWidth(0.5)
    canvas.line(1 * inch, h - 0.65 * inch, w - 1 * inch, h - 0.65 * inch)
    canvas.drawString(1 * inch, 0.55 * inch, SITE)
    canvas.drawRightString(w - 1 * inch, 0.55 * inch, f"Page {doc.page}")
    canvas.restoreState()


# ---------------------------------------------------------------------------
# Content
# ---------------------------------------------------------------------------

def build_story() -> list:
    s: list = [NextPageTemplate("body"), PageBreak()]

    # --- Intro -------------------------------------------------------------
    s += [
        p("Start here", H1),
        p(
            "Drone mapping gets sold with big promises. This guide skips those. It gives you a plain way "
            "to decide whether a drone capture will pay for itself on <i>your</i> project, using your own "
            "numbers, and it is just as clear about when the answer is no."
        ),
        p(
            "It is written for general contractors, site and project managers, developers, owners' reps "
            "and land sellers around Rutherford County and the rest of Middle Tennessee."
        ),
        callout(
            "About the numbers in this guide",
            "Every dollar figure here is an <b>illustrative example</b>, not an industry statistic and not "
            "a quote. They are there to show how the math works. The worksheet on page 4 is built for "
            "you to swap in your own figures.",
            ORANGE,
        ),
        Spacer(1, 10),
    ]

    # --- 1. What you get -----------------------------------------------------
    s += [
        p("1. What you actually get", H1),
        p(
            "A drone capture means flying a planned pattern over the site and taking hundreds of "
            "overlapping photos, which software stitches into products you can measure and share "
            "(a method called photogrammetry). Here is what comes out of it:"
        ),
        grid(
            [
                head("Deliverable", "What it is", "Typical use"),
                ["<b>Orthomosaic</b>", "One sharp, top-down map of the whole site, stitched from many photos and scaled so you can measure on it.",
                 "Site layout checks, overlaying plans, dated records, marketing."],
                ["<b>3D model</b>", "A textured 3D mesh of the site, structures or stockpiles you can spin and measure.",
                 "Stakeholder reviews, stockpile volume estimates, context for design."],
                ["<b>Gaussian splat</b>", "A photo-real 3D scene that opens in a web browser and feels like walking the site.",
                 "Remote owners, investors and land buyers who can't visit."],
                ["<b>Progress capture</b>", "The same flight repeated on a schedule (weekly, monthly or per milestone).",
                 "Side-by-side comparisons over time; a dated history of the job."],
                ["<b>Aerial photos and video</b>", "Still images and short clips from planned angles.",
                 "Updates, proposals, listings and social posts."],
            ],
            [1.35 * inch, 2.85 * inch, 2.3 * inch],
        ),
        Spacer(1, 10),
        p("What a standard drone capture is not", H3),
        *bullets([
            "<b>Not a land survey.</b> Measurements are good for planning and comparing. Anything used for "
            "a boundary, a design surface or a payment quantity should be confirmed by a licensed surveyor.",
            "<b>Not survey-grade accuracy by default.</b> Accuracy depends on the equipment and on whether "
            "ground control points or RTK positioning are used. Always ask what you will get and how it is checked.",
            "<b>Not able to see under trees, or see heat.</b> Photogrammetry only maps what the camera sees. "
            "Bare ground under heavy canopy calls for LiDAR; roof moisture or solar panel checks call for a thermal camera.",
        ]),
    ]

    # --- 2. Where the value is ----------------------------------------------
    value_cases = [
        (
            "A. Progress documentation",
            "Replaces site walks to photograph conditions and hours spent sorting phone pictures. One "
            "flight captures the whole site at a single moment, dated, from the same angles each time.",
            "Hours of project manager or superintendent time per update, and a cleaner record when someone "
            "asks \"what did it look like on the 14th?\"",
        ),
        (
            "B. Dispute and change-order defense",
            "A dated overhead record of what was in place and when: subgrade before a pour, utilities "
            "before backfill, the condition of a neighbor's fence before work started, where material was staged.",
            "The value is in risk, not daily savings. One avoided argument over a delay, damage claim or "
            "disputed quantity can be worth more than a year of flights.",
        ),
        (
            "C. Stakeholder and owner updates",
            "Owners, investors and out-of-town partners see the site in a browser instead of driving out. "
            "A short monthly update with an orthomosaic or 3D view answers most \"how's it going?\" calls.",
            "Fewer trips for remote stakeholders and fewer meetings to explain progress. It can support "
            "draw conversations, but it does not replace a lender's required inspection.",
        ),
        (
            "D. Stockpile and earthwork estimates",
            "A 3D model of stockpiles or a graded area lets you estimate volumes without climbing piles or "
            "pacing them off.",
            "Faster inventory checks and a second opinion on material quantities. Treat the result as an "
            "estimate unless the capture used survey control.",
        ),
        (
            "E. Land and property listings",
            "Aerial photos, an orthomosaic and a 3D or splat walkthrough show acreage, road frontage, access, "
            "terrain and surroundings in a way ground photos can't.",
            "Helps out-of-area buyers shortlist a property without a trip. Any property lines drawn on "
            "images should be labelled as approximate.",
        ),
    ]
    s += [p("2. Five places it saves money or time", H1),
          p("Most of the return from drone mapping comes from one of these five uses. If none of them "
            "fits your project, skip the drone.")]
    for title, what, where in value_cases:
        s.append(KeepTogether([
            p(title, H2),
            grid(
                [
                    [p("<b>What it replaces</b>", CELL), p(what, CELL)],
                    [p("<b>Where the value is</b>", CELL), p(where, CELL)],
                ],
                [1.45 * inch, 5.05 * inch],
                header=False,
            ),
        ]))
    s.append(PageBreak())

    # --- 3. Worksheet --------------------------------------------------------
    def row(letter: str, label: str, hint: str) -> list:
        return [p(f"<b>{letter}</b>", CELL), p(label, CELL), p(hint, HINT), FillField(f"line_{letter}", width=1.15 * inch)]

    worksheet = grid(
        [
            head("Line", "Item", "Hint", "Your number"),
            ["", p("<b>Time value</b>", CELL_B), "", ""],
            row("A", "Hours saved per update (site walks, photo sorting, report prep)", "Be conservative. 1 to 4 hours is common."),
            row("B", "Loaded hourly cost of the person whose time is saved ($)", "Wage plus burden, or what you bill."),
            row("C", "Number of captures over the project", "Example: monthly for 8 months = 8."),
            row("D", "Time value = A x B x C", ""),
            ["", p("<b>Travel value</b>", CELL_B), "", ""],
            row("E", "Site trips avoided by owners, partners or office staff", "Over the whole project."),
            row("F", "Cost per trip ($)", "Their time plus mileage."),
            row("G", "Travel value = E x F", ""),
            ["", p("<b>Risk value</b>", CELL_B), "", ""],
            row("H", "Chance of a dispute, claim or delay argument on this job (%)", "Your honest guess, e.g. 10%."),
            row("I", "Likely cost if one happens ($)", "Legal time, rework, withheld payment."),
            row("J", "Share of that cost a dated aerial record could save (%)", "Be modest. 10 to 30% is a sane range."),
            row("K", "Risk value = H x I x J", ""),
            ["", p("<b>Result</b>", CELL_B), "", ""],
            row("L", "Total value = D + G + K", ""),
            row("M", "Total capture cost ($)", "From your quote."),
            row("N", "Net return = L - M", ""),
            row("O", "ROI = N / M x 100 (%)", "Above 0% means it pays for itself on your numbers."),
        ],
        [0.45 * inch, 2.9 * inch, 1.85 * inch, 1.3 * inch],
    )
    s += [
        p("3. The ROI worksheet", H1),
        p(
            "Fill in what applies and leave the rest blank. You can type straight into this page in most PDF "
            "readers, or print it. The formula is simple:"
        ),
        callout(
            "The formula",
            "<b>ROI = (Time value + Travel value + Risk value - Capture cost) / Capture cost</b>",
            ORANGE,
        ),
        Spacer(1, 6),
        worksheet,
        Spacer(1, 4),
        p("Tip: if the project only works on paper because of a large risk value, that is still a real "
          "reason. Insurance works the same way. Just keep your guesses honest.", SMALL),
        PageBreak(),
    ]

    # --- Worked examples -------------------------------------------------------
    s += [
        p("Worked examples", H1),
        callout(
            "Illustrative only",
            "These are made-up projects with round numbers to show the math. They are not results from a "
            "real job and not Six1Five Studio pricing. Your quote and your numbers will differ.",
            ORANGE,
        ),
        p("Example 1: 8-month commercial site, monthly progress capture", H2),
        grid(
            [
                head("Line", "Item", "Example"),
                ["D", "Time value: 3 hours saved x $75/hour x 8 captures", "$1,800"],
                ["G", "Travel value: 4 owner trips avoided x $300 each", "$1,200"],
                ["K", "Risk value: 10% chance x $30,000 dispute x 25% saved", "$750"],
                ["L", "<b>Total value</b>", "<b>$3,750</b>"],
                ["M", "Capture cost (example figure)", "$2,800"],
                ["N", "Net return", "$950"],
                ["O", "<b>ROI</b>", "<b>about 34%</b>"],
            ],
            [0.55 * inch, 4.45 * inch, 1.5 * inch],
        ),
        Spacer(1, 6),
        p("Takeaway: the return here is modest and comes mostly from saved time and trips. It improves on "
          "longer jobs, busier sites, or when an owner or lender is out of town."),
        p("Example 2: 30-acre land listing", H2),
        p(
            "For land, a simpler question works better: <b>how much sooner does it need to sell to pay for "
            "the aerial package?</b>"
        ),
        grid(
            [
                head("Item", "Example"),
                ["Monthly holding cost (taxes, interest, mowing, insurance)", "$1,500"],
                ["Aerial package cost (example figure)", "$600"],
                ["Break-even: package cost / monthly holding cost", "0.4 months, about 12 days"],
            ],
            [4.5 * inch, 2.0 * inch],
        ),
        Spacer(1, 6),
        p("Takeaway: if better visuals shorten the sale by roughly two weeks, or bring one extra serious "
          "out-of-town buyer, the package has paid for itself. If the property sells on location alone, it may not."),
        p("Example 3: stockpile check", H2),
        p(
            "A yard manager suspects the count on a stone pile is off. A capture estimates the pile at 250 "
            "cubic yards less than the books show. At an example price of $35 per cubic yard, that is about "
            "<b>$8,750</b> of material worth investigating. The drone did not prove the loss. It flagged "
            "where to look, quickly and without anyone climbing the pile."
        ),
        PageBreak(),
    ]

    # --- 4. When it is NOT worth it -------------------------------------------
    s += [
        p("4. When it is NOT worth it", H1),
        p("A good provider should talk you out of a flight when it won't help. Skip it, or choose something else, when:"),
        *bullets([
            "<b>The site is small and simple.</b> A single residential lot with a short schedule is usually "
            "covered by a phone walk-around.",
            "<b>You need survey-grade numbers.</b> Payment quantities, boundaries, design topography and "
            "as-built certification belong with a licensed surveyor, or with a provider using RTK or ground control.",
            "<b>The ground is under heavy trees.</b> You need LiDAR to see bare earth through canopy.",
            "<b>The work is inside or underground.</b> Interiors, utilities already buried and MEP rough-in "
            "need a different tool, such as a ground-based scanner or a 360 camera.",
            "<b>Nobody will look at it.</b> If no one has time to open the map or compare captures, the "
            "data has no value. Decide who reviews it before you buy it.",
            "<b>The job is too short for comparisons to matter.</b> Progress capture shines over months, not days.",
            "<b>You need it in conditions a drone can't fly.</b> High wind, rain, low cloud and some "
            "restricted airspace will move the date.",
        ]),
        Spacer(1, 6),
    ]

    # --- 5. Questions to ask ------------------------------------------------
    questions = [
        ("Are you Part 107 certified?", "Commercial drone work in the US requires an FAA Remote Pilot Certificate. Ask to see it."),
        ("Are you insured, and can we be listed on the certificate?", "Ask for a certificate of insurance (COI) before anyone flies over your site."),
        ("What accuracy will I get, and how is it checked?", "Ask whether they use ground control points or RTK, and get the answer in writing."),
        ("What exactly will you deliver?", "Names and formats, such as GeoTIFF, OBJ, PLY or a PDF report, and how I open each one."),
        ("How fast is turnaround?", "Same week? Two weeks? It matters if you need it for a meeting."),
        ("Can you fly the same path every time?", "Repeatable flights are what make month-to-month comparisons work."),
        ("How do you handle airspace and weather?", "Near MQY or BNA, ask how they get authorization and what happens on a rain day."),
        ("Who owns the data, and how long do you keep it?", "You should be able to keep and share what you paid for."),
        ("Can I view it without special software?", "A browser link is easier for owners and partners than a desktop program."),
        ("Can I see a sample from a similar site?", "A real example tells you more than any sales page."),
    ]
    s += [p("5. Ten questions to ask any drone provider", H1)]
    q_rows = [head("#", "Question", "Why it matters")]
    for i, (q, why) in enumerate(questions, start=1):
        q_rows.append([str(i), f"<b>{q}</b>", why])
    s += [grid(q_rows, [0.35 * inch, 2.75 * inch, 3.4 * inch]), PageBreak()]

    # --- 6. Checklist --------------------------------------------------------
    checklist = [
        "Site address and a map or KML of the area to capture",
        "Site contact on the day, gate access and any PPE or orientation rules",
        "What decision the data will support (progress, quantities, marketing, records)",
        "Who will review it, and in what format they need it",
        "Schedule: one-time, weekly, monthly or tied to milestones",
        "Key dates the capture has to land before (owner meeting, pour, listing date)",
        "Known hazards: cranes, power lines, tall trees, nearby schools or homes",
        "Airspace check done (near MQY or BNA?) and a backup weather date",
        "Neighbors or tenants who should know a drone will be overhead",
        "Where files will be delivered and stored",
    ]
    check_rows = Table(
        [[CheckBox(), p(item, CALLOUT)] for item in checklist],
        colWidths=[0.3 * inch, 6.2 * inch],
    )
    check_rows.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 2),
        ("TOPPADDING", (0, 0), (-1, -1), 3),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 3),
    ]))
    s += [
        p("6. Pre-flight planning checklist", H1),
        p("Have these answers ready before the first flight. It makes the quote faster and the data more useful."),
        check_rows,
        Spacer(1, 8),
        callout(
            "Airspace in Rutherford County",
            "Much of the county sits near Smyrna Airport (MQY) or Nashville International (BNA) airspace. "
            "A licensed Part 107 pilot can request FAA authorization for those areas, often quickly through "
            "the FAA's LAANC system, but it is something to plan for and not assume.",
        ),
        Spacer(1, 14),
    ]

    # --- About / CTA ---------------------------------------------------------
    s += [
        KeepTogether([
            p("About Six1Five Studio", H1),
            p(
                "Six1Five Studio is a drone mapping and reality capture studio based in Smyrna, Tennessee, "
                "serving Rutherford County and Middle Tennessee. Flights are run by an FAA Part 107 "
                "certified remote pilot."
            ),
            grid(
                [
                    head("What I deliver today", "What I don't do in-house"),
                    [
                        "Orthomosaics, 3D models, Gaussian splats, scheduled progress capture, and aerial photos and video, made with photogrammetry.",
                        "LiDAR, survey-grade RTK mapping and thermal inspection. If your project needs them, I'll tell you up front.",
                    ],
                ],
                [3.25 * inch, 3.25 * inch],
            ),
            Spacer(1, 10),
            callout(
                "Want a second opinion on your numbers?",
                "Fill in the worksheet and send it over with a few details about your site. I'll tell you "
                f"honestly whether a flight makes sense, and what it would take.<br/><br/>"
                f"<b><a href='{CONTACT_URL}' color='#0EA5E9'>{SITE}/#contact</a></b>",
                ORANGE,
            ),
        ]),
    ]
    return s


def build() -> Path:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=LETTER,
        leftMargin=1 * inch,
        rightMargin=1 * inch,
        topMargin=0.95 * inch,
        bottomMargin=0.85 * inch,
        title="Is Drone Mapping Worth It for Your Project? Reality Capture ROI Guide",
        author="Six1Five Studio",
        subject="ROI guide and worksheet for drone mapping and reality capture",
        creator="Six1Five Studio",
    )
    full = Frame(0, 0, LETTER[0], LETTER[1], id="cover", leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    body = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="body")
    doc.addPageTemplates([
        PageTemplate(id="cover", frames=[full], onPage=draw_cover),
        PageTemplate(id="body", frames=[body], onPage=draw_page),
    ])
    doc.build(build_story())
    return OUTPUT


if __name__ == "__main__":
    path = build()
    print(f"Wrote {path.relative_to(REPO_ROOT)} ({path.stat().st_size / 1024:.0f} KB)")
