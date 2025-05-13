# /slant README

## Table of Contents

1. [Introduction](#introduction)
2. [Links](#links)
3. [User Experience (UX)](#user-experience-ux)
4. [User Stories & Methodology](#user-stories)
5. [Design](#design)
6. [Features](#features)
7. [Security](#security)
8. [Bugs & Issues](#bugs—issues)
9. [Future Features](#future-features)
10. [Testing](#testing)
11. [Deployment](#deployment)
12. [Technologies Used](#technologies-used)
13. [Credits and Acknowledgements](#credit--acknowledgements)

## Introduction

*NB - This repository is the frontend React application for Portfolio Project 5 of Code Institute's full stack development course. Please see the link section below for navigation to the front end application and project board.*

Modern current affair news media is a minefield. There are so many sources and articles competing for your attention, pulling you this way and that, ensuring that most people will end up in their own ‘bubble’ – a place where they only consume stories that are algorithmically tailored to them.

slant does things differently.

slant is a totally objective repository of journalistic articles where users can submit and share pieces – either written independently or from one of the major outlets – and comment, favourite and share their favourites. 

However, this is not all – each submission to slant is ranked by two systems, ‘legacy’ bias, and bias according to the slant users. 

slant aims to break the news media wheel of doom and expand the horizons of it’s users, and provide a website where the bias of a story is voted on by the users of the website – allowing each and every user to examine journalistic prejudices and begin to examine the media from a Critical stance, with each piece of content receiving ratings based on user inputs.

slant created using **React** and **Django REST framework**, and is my PP5 submission for Code Institute Advanced Front End.

## Links

- [Deployed Site](https://slant-react-38faa77003fe.herokuapp.com/)
- [Backend](https://github.com/AlbaXIII/slant-api/)
- [Deployed Backend](https://slantapi-c636400a6ffd.herokuapp.com/)
- [Project Kanban Boar](https://github.com/users/AlbaXIII/projects/11)

## User Experience (UX)

### Strategy 

slant is a journalistic archive containing independent and legacy media articles that can be access by subscribed users. Logged in users can then browse the library of pieces, filter by sector & title keyword, like, share and favourite at their leisure, and most importantly vote on bias – the score of which is displayed at the tope of each article. 

### Site Goals

* To provide **all site users & visitors** a database of submitted news and current affairs articles that any user of the site can examine for free.
* To provide **all site users & visitors** the ability to filter and sort the articles by user-designated criteria, for example subject and keyword.
* To provide **site members** the functionality to comment, favourite and rank articles based on a  back-end defined scale.
* To provide **site members** the ability to create a profile and choose a user ‘flair’. Users can then access a profile page with their saved & submitted articles.

### Ideal User

The ideal user of slant is a user who is willing to analyse the news they are digesting through their usual methods, and users who are willing to expand their knowledge of media literacy through more intense scrutiny on the fourth and fifth estates.

## User Stories & Methodology 

### Agile Working

The working schedule of this project was outlined by a single project [Kanban board](https://github.com/users/AlbaXIII/projects/11), sorted by project category and purpose. Furthermore, the user stories are also subcategorised with MoSCoW prioritisation -  incrementally increasing the effectiveness of time management on this project.

### EPICs

In order to further organise what could easily be an overly daunting project, I added an EPIC grouping system to the granular user stories. This system created a hierarchy and broke the project down into workable pieces, creating an effective development flow whilst working towards the overarching goal of project completion. 

**critical-eye-drf**

database setup
article model
comment model
review model
profile model
deployment

admin documentation

**critical-eye-react**

initial setup
navigation & user validation 
adding & submitting articles
articles page
article detail 
profile page
final deployment

admin documentation

### User Stories

User stories for this project are based on a custom template below, separated into project categories and linked to up completion benchmarks from which the user story can be completed.

“Using **slant**;

 A **visitor/user/admin** can **ability** in order to **result**”

### Completion benchmarks

CB1 - 

CB2 - 

CB3 - 

The total list of user stories noted in the Kanban board are listed below, organised into their respective EPIC & MoSCoW categories.

**slant-api**

database setup

* Link project to kanban board
* Initialise Django REST apps, link database & cloudinary storage
* Create SuperUser for Admin access
* Deploy to Heroku

article model

* add article model and migrate
 
comment model

* add comment model and migrate

review model

* add review model and migrate

profile model

* add profile model and migrate

final deployment

* finalise thorough testing of all models
* complete final deployment to Heroku

admin documentation

* complete initial README documentation


**slant**

initial setup

* create React app – M
* initial deployment to Heroku – M

navigation & user validation 

* add navbar component to all pages – M
* add page routing system for non-refreshing navigation – M
* create signup form to add new user accounts – M
* create operational log in & log out forms – M
* add navbar conditional account status for visual indicator of account login condition – S

adding & submitting articles

* create and submit articles with subject & publisher tagging – M
* from main article page, users can access a more detailed view for more information, including engagement metrics for example comments and rating – M
* members can add likes to articles – S
* members can add dislikes to articles – C
* members can add to article rating system – S
* once submitted, authenticated site members can edit their own articles – M
* once submitted, authenticated site members can delete their own articles – M

articles page

* users can filter articles by subject matter and submitted publisher – M
* users can use search bar to search for articles based on keywords – S
* site members can further filter articles based on publisher – S
* article list to have infinite scroll feature for seamless navigation with no pagination – M

article detail 

* all users can view comments and rating system on detailed article page – M
* site members can add comments using built-in comment form on detail view – M
* site members can sort comments by submission date – S
* once submitted, site members can edit their created comments – M
* once submitted, site members can delete their created comments – M
* site members can access rating system and add their own opinion using intuitive CTA – M

profile page

* site members can access a profile page with a custom profile image – M
* profile page will display number of submitted articles & liked/rated posts – M
* profile page will show list of liked/submitted articles navigable by tab delineation – S
* users can access profile page of other users to view their post history – C

final deployment

* thorough testing implemented on all site features – M
* final deployment to Heroku – M

admin documentation

* finalise README – M


### Site Visitor Goals

- As a site visitor I would like to understand the purpose of the website when accessing the home page.
- As a site visitor I would like to be able to always be cognizant of site navigation status through clear labelling and navigation components.
- As a site visitor I would like to be able to browse posted articles, and sort by subject and publisher.
- As a site visitor I would like to understand the account registration process and recognise it is mandatory to post my own content.
- As a site visitor I would like to be able to easily create an account through clear site navigation.

###  Site Member Goals

- As a site member I can access the login/logout functionality on all pages.

- As a site member I would like to be able to see authentication status on all pages.

- As a site member I would like to be able to submit my own articles from all pages using the built- in submission form once logged in.

- As a site member I would like to be able to edit or delete my submitted articles.

- As a site member I would like to able to like, add comments, and submit bias rating to other articles. 

- As a site member I would like to be able to view a profile page with my submitted and liked pages.

### Administrator Goals

- As a site administrator I can use full CRUD operations on all articles on the database.

- As a site administrator I can add or delete profiles.


## Design

### Wireframes

### Color Scheme

### ERD

### CRUD Table

### API Endpoints

## Features

## Security

## Bugs & Known Issues

## Future Features

## Testing

## Deployment

## Technologies Used

## Credits and Acknowledgments 