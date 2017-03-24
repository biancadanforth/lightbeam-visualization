# Lightbeam Visualization

A visualization prototype for the Mozilla Firefox add-on, Lightbeam.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Installing

1. Clone the repository in Git.

```
git clone https://github.com/biancadanforth/lightbeam-visualization.git
```

2. Set up a web server.

You need to run the files off a web server to properly load the lightbeamData.JSON file.  I used Python SimpleHTTPServer. See their documentation for how to set it up initially, but here's a post-set-up example to run the server.

```
cd lightbeam-visualization

python -m SimpleHTTPServer
```

3. View the index.html file in a browser of your choice (Firefox recommended).

```
http://localhost:8000/
```

The raw Lightbeam data (lightbeamData.JSON) that this prototype is based on can be found in the root directory.

## Viewing the processed data

You can view the list of third-party sites and their faux 'POST' request packet sizes I extracted from the raw data in the browser's console.

## Built With

* JavaScript
* CSS3
* HTML5
* Inkscape

## Contributing

Please first discuss the change you wish to make via Issues on GitHub or by e-mail with me before making a change.

## Versioning

I use [SemVer](http://semver.org/) for versioning.

## Authors

* **Bianca Danforth** - *Initial work* - [biancadanforth](https://github.com/biancadanforth)

See also the list of [contributors](https://github.com/biancadanforth/lightbeam-visualization/contributors) who participated in this project.

## License

This project is licensed under the Mozilla Public License Version 2.0 - see the [LICENSE.md](LICENSE.md) file for details.

## Acknowledgments

* This README extended from a template by [PurpleBooth](https://github.com/PurpleBooth).
