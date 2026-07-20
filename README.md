<a id="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

<br />
<div align="center">

  <h3 align="center">D-Triard NASA SAC25</h3>

  <p align="center">
    Django event-planning app that uses NASA POWER climate data and OpenStreetMap geocoding to estimate rain risk for future events and save forecast history.
    <br />
    <a href="docs/GITHUB_DESCRIPTION.md"><strong>Explore the docs</strong></a>
    <br />
    <br />
    <a href="#usage">View Usage</a>
    &middot;
    <a href="https://github.com/ille-amissus/D-Triard-NASA-SAC25/issues/new">Report Bug</a>
    &middot;
    <a href="https://github.com/ille-amissus/D-Triard-NASA-SAC25/issues/new">Request Feature</a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a><ul><li><a href="#built-with">Built With</a></li></ul></li>
    <li><a href="#getting-started">Getting Started</a><ul><li><a href="#prerequisites">Prerequisites</a></li><li><a href="#installation">Installation</a></li></ul></li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#how-it-works">How It Works</a></li>
    <li><a href="#project-structure">Project Structure</a></li>
    <li><a href="#validation">Validation</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgments">Acknowledgments</a></li>
  </ol>
</details>

## About The Project

<p align="center">
  <img src="docs/images/UI.png" alt="D-Triard home screen" width="86%">
</p>

Django event-planning app that uses NASA POWER climate data and OpenStreetMap geocoding to estimate rain risk for future events and save forecast history.

The repository currently offers:

- User signup, login, logout, and saved event history
- City and date based rain-risk calculation
- NASA POWER historical climate data lookup
- OpenStreetMap Nominatim geocoding
- Weighted probability based on precipitation, humidity, temperature, and wind
- Tailwind-powered planning and history interface


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

- Python
- Django
- SQLite
- Pandas
- Requests
- NASA POWER API
- OpenStreetMap Nominatim
- HTML
- CSS
- JavaScript

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started

Follow these steps to clone the repository and run the project locally.

### Prerequisites

- Python 3
- pip
- Internet access for NASA POWER and Nominatim requests

### Installation

~~~bash
git clone https://github.com/ille-amissus/D-Triard-NASA-SAC25.git
cd D-Triard-NASA-SAC25
python -m venv .venv
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
~~~

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Useful commands and entry points:

~~~bash
python manage.py runserver
~~~

~~~bash
Open http://127.0.0.1:8000/
~~~

~~~bash
Use /api/climatology/?city=Sakarya&month=7&day=15
~~~

### Screenshots

These screens cover the main planning flow: accessing the app, creating an event, seeing the forecast output, and checking event history.

<p align="center">
  <img src="docs/images/UI.png" alt="D-Triard home screen" width="48%">
  <img src="docs/images/Plan_Event.png" alt="Event planning form" width="48%">
</p>

<p align="center">
  <img src="docs/images/OutPut.png" alt="Rain risk output" width="48%">
  <img src="docs/images/Event_History.png" alt="Saved event history" width="48%">
</p>

<p align="center">
  <img src="docs/images/Access.png" alt="Access screen" width="48%">
</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## How It Works

```text
User event form -> Django route -> geocoding -> NASA POWER climatology -> rain probability -> saved event history
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Project Structure

- NasaRain/ - Django project settings
- myapp/ - views, URLs, models, templates, static assets, services
- docs/ - API, deployment, tutorial, visuals, and GitHub notes
- requirements.txt - Python dependencies
- manage.py - Django CLI

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Validation

Run the most relevant checks for this repository:

~~~bash
python manage.py check
~~~

~~~bash
python manage.py test
~~~

Live checks need the matching local services, datasets, credentials, or lab tools installed first.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Roadmap

- Refine the rain probability formula as more climate indicators and validation examples are added.
- Improve the saved-event history view with filtering by city, date, and risk level.
- Cache geocoding and climate requests so repeated checks are faster and friendlier to external APIs.
- Add deployment notes for a hosted Django environment with environment-based settings.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributing

Contributions are welcome for documentation, examples, tests, and implementation improvements.

1. Fork the project.
2. Create your feature branch:

   ~~~bash
   git checkout -b feature/AmazingFeature
   ~~~

3. Commit your changes:

   ~~~bash
   git commit -m "Add some AmazingFeature"
   ~~~

4. Push to the branch:

   ~~~bash
   git push origin feature/AmazingFeature
   ~~~

5. Open a pull request.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top Contributors

<a href="https://github.com/ille-amissus/D-Triard-NASA-SAC25/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ille-amissus/D-Triard-NASA-SAC25" alt="Top contributors for D-Triard NASA SAC25" />
</a>

## License

This repository does not include a root license yet. Add one before reusing or distributing the project outside its original coursework, lab, or prototype context.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contact

Project owner: [@ille-amissus](https://github.com/ille-amissus)

Project Link: [https://github.com/ille-amissus/D-Triard-NASA-SAC25](https://github.com/ille-amissus/D-Triard-NASA-SAC25)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Acknowledgments

- README structure adapted from [ahmed3bahaa/readme-template](https://github.com/ahmed3bahaa/readme-template).
- Project files, reports, fixtures, and documentation included in this repository.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

[contributors-shield]: https://img.shields.io/github/contributors/ille-amissus/D-Triard-NASA-SAC25.svg?style=for-the-badge
[contributors-url]: https://github.com/ille-amissus/D-Triard-NASA-SAC25/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ille-amissus/D-Triard-NASA-SAC25.svg?style=for-the-badge
[forks-url]: https://github.com/ille-amissus/D-Triard-NASA-SAC25/network/members
[stars-shield]: https://img.shields.io/github/stars/ille-amissus/D-Triard-NASA-SAC25.svg?style=for-the-badge
[stars-url]: https://github.com/ille-amissus/D-Triard-NASA-SAC25/stargazers
[issues-shield]: https://img.shields.io/github/issues/ille-amissus/D-Triard-NASA-SAC25.svg?style=for-the-badge
[issues-url]: https://github.com/ille-amissus/D-Triard-NASA-SAC25/issues
