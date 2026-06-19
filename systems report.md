                        Software Engineering Stage 6 (Year 12) – Sample Software Engineering Project Template | 0

Software Engineering Stage 6

(Year 12) – Sample Software

Engineering Systems Report Template

Tempe High School

Software Engineering Stage 6 – Software Engineering Project Template | 1

Contents

1. Identifying and defining ................................................................................................................ 2

1.1. Define and analyse problem requirements........................................................................ 2

1.2. Tools to develop ideas and generate solutions ................................................................ 5

2. Research and planning ................................................................................................................ 9

2.1. Project management ............................................................................................................. 9

2.2. Quality assurance ................................................................................................................11

2.3. Systems modelling ..............................................................................................................14

3. Producing and implementing .................................................................................................... 22

4. Testing and evaluating ............................................................................................................... 23

4.1. Evaluation of code ...............................................................................................................23

4.2. Evaluation of solution ..........................................................................................................24

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 2

1. Identifying and defining

1.1. Define and analyse problem requirements

Problem context

Students analyse the problem by describing each of its individual components and

explaining how each of these components contribute to the problem needing resolution.

What I am trying to solve is the problem where finding restaurants to eat at can be tedious

or time consuming. The components of this problem are:

- Decision fatigue: having to choose a restaurant from a massive selection of different

cuisines or prices or locations can tire you out

- Comparisons between restaurants: having to switch apps or websites to see the

different price points or opening hours of each restaurant can be time

consuming/tedious

-

Information overload: there are too many platforms (Google maps, Uber Eats,

Instagram, blogs, etc.) that can have differing information

Needs and opportunities

Students describe the needs of the new system to be built based on the problem context

and using the table given below.

Need

Description

1. Limit selection

The selection of restaurants displayed should be small so

the user isn’t bombarded with choices, so they could

only be displayed based on distance or another

factor.

2. Have all information in one

The restaurants’ information (cuisine, type, price,

place

distance) should be shown in my app and not

have the user exit to look for themselves

3. Information should be

The information should be gathered in one reliable

consistent and reliable

place to ensure it is consistent

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 3

Boundaries

Students analyse any limitations or boundaries in which this new system will need to
operate. Boundaries can include but are not limited to: hardware, operating systems,
security concerns etc.

Hardware

- System must run smoothly on mobile devices and other devices

o Since the app will mostly be designed for mobile, it has to be performant
preferably on older phones as well as other devices like desktops too.

- Requires internet connection
- Must work on a wide range of screen sizes

o The app should be responsive and usable on screens as small as phones as

well as monitors

Software

- Must work on all major browsers (Chrome, Safari, Firefox)
- APIs may have rate limits or costs

o Depending on which maps API in use (Google Maps or Mapbox or whatever
else), the number of requests I can have may be limited or induce costs if
there are too many

Security

- Accounts should be secured with bcrypt
- SQL database should be secure
- Must comply with privacy legislations

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 4

Requirements specification

From meeting with Leo Projceski

Functional requirement

Priority

Users can browse a map and nearby restaurants are highlighted

High

Categorise restaurants e.g. based on cuisine, type of restaurant and if it

High

is open

Sort the restaurants e.g. based on star rating, distance and price

Medium

Show a route on how to get there

Random restaurant picker

Medium

Low

Users can sign in with an account to create and save categories e.g. an

Low

already visited list

Nonfunctional requirement

Specification

Quick to load and use

App loads in under 2 seconds

Accounts are secure

Usernames and passwords are stored in a

SQLite database with parameterised

queries, passwords are encrypted with

bcrypt

Both mobile and desktop functionality

Website is responsive and usable for all

common screen sizes and browsers

Easy to use

Simple UI with very few buttons and

understandable navigation

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 5

1.2. Tools to develop ideas and generate solutions

Application of appropriate software development tools

Students apply appropriate tools such as brainstorms, mind-maps, storyboards and

prototypes.

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 6

1.3. Implementation method

Students explain the applicability of the implementation method for the current project.

These methods are normally direct, phased, parallel, or pilot.

The implementation method I will use is the ‘direct’ method, seeing as my project isn’t big

with a large user base, and it isn’t an essential app so there is very little risk to be had if a

problem were to occur. The other methods weren’t used because I think that they are

more suited for larger projects unlike mine, and they would be more complex to execute

for such a simple app.

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 7

1.4. Financial feasibility

Students are to conduct a financial feasibility study, including producing an opening-day

balance sheet, to assess whether their application is financially viable.

SWOT Analysis

Strengths

Weaknesses

• Skilled in python and Flask from old

• Limited mobile responsive design

tasks

skills

• Familiar with SQL

• No experience with Google maps

API

• No experience with making an

installable PWA

Opportunities

Threats

•

If successful could add integration

• Google maps API may cost money /

with other systems like reservations

be unreliable

Study

Go or

Assessment and evidence

No Go?

Market feasibility

Cost of

development

Cost of ownership

Income potential

Future expansion

opportunities

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 8

Opening Day Balance Sheet

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 9

2. Research and planning

2.1. Project management

Software development approach

Students explain the software development approach most applicable for this current

project. These are normally: Waterfall, Agile and WAgile.

For this project, the development approach I have decided to use is the WAgile method.

This involves Waterfall’s structured planning first, then Agile’s development onwards.

WAgile is the most applicable for this project because documentation is needed in the

systems report before development, but since I am working with clients who may change

their mind, agile development will be more flexible.

The development process would most likely look like:

1.  Plan and complete all documentation and design first in the systems report

2.  Moving on to development where sprints will be done to improve the program and

gain user feedback

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 10

Scheduling and task allocation

Students develop a Gantt Chart that details the tasks required to be completed, person or

people assigned to each task, timeline that does not exceed the project due date,

resources required. In addition, students identify any collaborative tools used. For

example Repl.it, GitHub and so on.

Phase/Sprint

Dates

Goal

Deliverable

Phase 0

Weeks 1–2

Ideation

3 ideas, idea selected,

diary started

Phase 1

Weeks 3–4

Requirements

Client meeting, FR/NFR

Phase 2

Weeks 5–6

Design

documented, SWOT done

DFD, structure chart,

wireframes, UAT draft

Sprint 1

Week 7

Skeleton and database +
start map API

Working login page,

skeleton main page and

buttons

Empty database made

Begin map API interfacing

Sprint 2

Week 8

Map API

Working map interface and

Sprint 3

Week 9

Accounts + extra
functionality

location markers with

filtering/searching or

whatever

Add accounts and custom

or saved categories + the
random

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 11

2.2. Social and Ethical Issues

Social and ethical Issues

Privacy

Since my app will use location services, the issue of privacy arises as storing location data

of users' long term or forcing them to grant their location is not ethical. To address this, my

app will:

- Only collect current location and not long-term history

- Process location client side as to not store personal data on the servers

- Asks users for location permissions

- Have a privacy notice to explain what data is used and why

Accessibility

Because my app will be aimed towards a wide public audience, it must support people with

disabilities and meet WCAG principles. This will be done by:

- The map interface includes keyboard navigation, zoom controls, and high -contrast

markers.

- All filters (cuisine, price, distance, rating) are implemented using semantic HTML

and ARIA labels so screen readers can interpret them.

- Colour isn’t the only way to transmit info (for example closed/open can also be text)

- The PWA is responsively designed to ensure usability on small screens

- Touch targets are large enough for users with motor impairments.

Security

Even though my app doesn’t store much personal data, it still must protect user

interactions and API communications. I can protect these by:

- Serving the PWA over HTTPS

- Having APIs use secure keys not exposed to the client

-

Implementing input validation to protect against attacks

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 12

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 13

Compliance and legislative requirements

Students explain compliance and legislative requirements their projects need to meet and

how they plan to mitigate them where possible. For example, projects that deal with

sensitive personal data being publicly available may fall under the Australian NSW Privacy

and Personal Information Act (1998) and/or Federal Privacy Act (1988). Alternatively,

international standards on information security management such as ISO/IEC 27001 may

also be applicable.

Compliance or

Methods for mitigation

legislative issue

Privacy Act 1988

•

Ask for permissions before accessing location

- Avoid storing personal information unless necessary

-

Include a clear privacy notice explaining how data is

used and shared

Copyright Act 1968

•

Follow API terms of service

- Ensure any restaurant images or logos are used

under fair use or open licences

© NSW Department of Education, Jun-26

Software Engineering Stage 6 (Year 12) – Sample Software Engineering Project Template | 14

2.3. Systems modelling

Students are to develop the given tables and diagrams. Students should consult the Software Engineering Course Specifications guide

should they require further detail, exemplars or information. Each subsection below should be completed with Section 1.1. in mind.

Data dictionaries and data types

Students take the needs identified in Section 1.1. of this Systems Report. For each need, students identify the variables required, data

types, format for display, and so on.

Need

1. Limit selection

Variable

Data type Format for

Size in

Size for

Description

Example

Validation

display

bytes

display

max_distance

Integer

“X km”

4 bytes

1-3

Max distance in a radius that

5

characters

restaurants are shown

user_location

Float

Decimal (6

8 bytes

~10

User’s latitude for distance

-33.8688

Must be

\_lat

dp)

characters

calculations

between -90

and 90

Tempe High School

Software Engineering Stage 6 – Software Engineering Project Template | 15

Need

user_location

Float

Decimal (6

8 bytes

~10

User’s longitude for distance

151.2093

Must be

\_lng

dp)

characters

calculations

between -180

and 180

Need

2. Have all the information in one place

Variable

Data type Format for

Size in

Size for

Description

Example

Validation

display

bytes

display

restaurant_na

String

Text

50 bytes

Up to 30

Name of the restaurant

“Europe Grill” Cannot be

me

chars

empty

cuisine_type String

Text

20 bytes

Up to 15

Type of cuisine

“Italian”

Must match

chars

predefined list

price_level

Integer

“”,“”,“$$”

4 bytes

1–3 chars Price category

2

Must be 1–3

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 16

distance_km

Float

“X.X km”

8 bytes

4–6 chars Distance from user

3.2

Must be ≥ 0

is_open

Boolean

“Open” /

1 byte

4–6 chars Whether the restaurant is

True

“Closed”

currently open

Must be

True/False

rating

Float

“X.X ★”

8 bytes

3–5 chars Average user rating

4.5

Must be

between 0 and

5

Need

3. Information should be consistent and reliable

Variable

Data type Format for

Size in

Size for

Description

Example

Validation

display

bytes

display

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 17

Data flow diagrams

Students develop data flow diagrams (DFDs) at Level 0 and Level 1. These diagrams should explicitly include the variables from the

data dictionaries previously identified as well as the needs identified in Section 1.1.

Level 0

Level 1

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 18

Structure charts

Students develop structure charts demonstrating how the procedures, modules or components of the final solution are interconnected.

© NSW Department of Education, Jun-26

Class diagrams

Students develop class diagrams demonstrating how each class is related to the other.

Software Engineering Stage 6 – Software Engineering Project Template | 19

Storyboards

Students develop storyboards, visually representing the software solutions they will build.

Mobile and desktop wireframes

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 20

Decision trees

Students develop decision trees to visually outline the logic flow and chain of decisions or selections the final solution will need.

© NSW Department of Education, Jun-26

Algorithm design

Students develop algorithms using methods such as pseudocode or flowcharts to solve the problem and meet the needs from Section

1.1. These algorithms should explicitly include the variables from the data dictionaries created in the previous section.

Software Engineering Stage 6 – Software Engineering Project Template | 21

© NSW Department of Education, Jun-26

Software Engineering Stage 6 – Software Engineering Project Template | 22

3. Producing and implementing

Solution to software problem

Students are to include screen shots of their final developed solution here. Each

screenshot should include a caption that explains how it links to the:

• Needs identified in Section 1.1.

• Components of Section 2.3. such as the storyboards, data dictionaries and so on.

Version control

Students describe what version control system or protocol was implemented.

22

Software Engineering Systems Report Template

Software Engineering Stage 6 – Software Engineering Project Template | 23

4. Testing and evaluating

4.1. Evaluation of code

Methodology to test and evaluate code

Students explain the methodologies used to test and evaluate code. Methodologies

include:

• Unit, subsystem and system testing

• Black, white and grey box testing

• Quality assurance.

Code optimisation

Students explain the methodologies used to optimise code so that it runs faster and more

efficiently. Methodologies include:

• Dead code elimination

• Code movement

• Strength reduction

• Common sub-expression elimination

• Compile time evaluation – constant folding and constant propagation

• Refactoring

23

Software Engineering Systems Report Template

Software Engineering Stage 6 – Software Engineering Project Template | 24

4.2. Evaluation of solution

Analysis of feedback

Students analyse feedback given to them on the new system they have just created. This

feedback can be in the form of an interview, survey, focus group, observation or any other

applicable method. Students should also include overall positive, negative or neutral

sentiments towards the new system in their response.

Testing methods

Students identify the method or methods of testing used in this current project. For each

they use, students are to explain how and why it was used.

Method

Applicability

Reasoning

Functional testing

User Acceptance

testing

Live data

Simulated data

Beta testing

Volume testing

24

Software Engineering Systems Report Template

Software Engineering Stage 6 – Software Engineering Project Template | 25

Security Assessment

Students are to perform an extensive security assessment of their final application and

explain the countermeasures implemented.

Threat

Countermeasure

25

Software Engineering Systems Report Template

Software Engineering Stage 6 – Software Engineering Project Template | 26

Test data tables

Students identify variables which were used for either path and/or boundary testing. Students develop these test data tables based on

their algorithms versus their real code. Students then state the reason for including said variables.

Boundary testing

Variable

Maximum Minimum

Default Value

Expected Output Actual Output

Reason for Inclusion

26

Software Engineering Systems Report Template

Software Engineering Stage 6 – Software Engineering Project Template | 27

Analysis of solution against quality success criteria

Students are to take each quality success criteria from Section 2.2 and place it here. For

each quality criteria, analyse the components of the solution that met or did not meet each

quality criteria. Give reasons why each success criteria were or were not met.

Quality criteria

Met?

Analysis

27

Software Engineering Systems Report Template
