# RCSB Saguaro App Changelog

[Semantic Versioning](https://semver.org/)

## [0.2.23] - 2024-04-02
### Bug fix
- Bars with 0 value are not affected by `minBarLength`
### Dependency update
- audit fix

## [0.2.22] - 2024-01-30
### Bug fix
- Canvas click bug fixed 
### Dependency update
- Multiple dependencies update
- audit fix

## [0.2.21] - 2023-09-07
### Dependency update
- Multiple dependencies update

## [0.2.20] - 2023-09-07
### Improvement
- New configuration options `minBarLength` and `domainEmptyBins`

## [0.2.19] - 2023-09-06
### Bug fix
- Removed console log

## [0.2.18] - 2023-09-06
### Bug fix
- ChartJS click event bug fixed

## [0.2.17] - 2023-09-06
### Improvement
- ChartJS histogram axis label

## [0.2.16] - 2023-09-06
### Improvement
- ChartJS histogram strict domain min max value

## [0.2.15] - 2023-09-06
### Improvement
- ChartJS histogram domain max value

## [0.2.14] - 2023-09-06
### Bug fix
- ChartJS tooltip values type fixed

## [0.2.13] - 2023-09-06
### Bug fix
- ChartJS tooltip callback includes all values

## [0.2.12] - 2023-09-06
### Improvement
- ChartJS tooltip title and label

## [0.2.11] - 2023-09-06
### Bug fix
- ChartJS tooltip new line fixed 

## [0.2.10] - 2023-09-06
### Improvement
- ChartJS tooltip single label

## [0.2.9] - 2023-09-06
### Bug fix
- ChartJS height config bug fixed

## [0.2.8] - 2023-09-06
### Improvement
- ChartJS bar min length
- ChartJS bar width

## [0.2.7] - 2023-09-06
### Bug fix
- ChartJS histogram axis-y label size 
- ChartJS histogram axis-x domain start position

## [0.2.6] - 2023-09-05
### Bug fix
- ChartJS histogram bug fixed

## [0.2.5] - 2023-09-05
### Bug fix
- ChartJS y-axis labels overflow partial fix

## [0.2.4] - 2023-06-28
### Bug fix
- Update chart configuration on props change bug fixed

## [0.2.3] - 2023-06-27
### Ignore
- Publish error

## [0.2.2] - 2023-05-31
### Dependency update
- Victory update v36.6.10

## [0.2.1] - 2023-05-30
### Improvement 
- Exposed axis tick values configuration

## [0.2.0] - 2023-05-30
### Breaking change
- Removed `ChartConfigInterface.mergeDomainMaxValue` attribute. It should be responsibility of the library user

## [0.1.4] - 2023-05-30
### Configuration
- ChartJs histogram numerical x-axis 

## [0.1.3] - 2023-05-26
### Configuration
- ChartJs histogram click bug fixed

## [0.1.2] - 2023-05-26
### Bug fix
- ChartJs histogram/bars click bug fixed

## [0.1.1] - 2023-05-26
### Bug fix
- ChartJs histogram click bug fixed

## [0.1.0] - 2023-05-26
### Breaking change
- `ChartDataInterface` type replaced by `ChartDataColumnInterface`
  - This interface describes a column content
- `ChartDataValueInterface` type replaces `ChartDataValuesInterface`
  - This interface describe a column cell (stacked region)

## [0.0.9] - 2023-05-25
### Improvement
- ChartJs performance improved

## [0.0.8] - 2023-05-24
### Bug fix
- empty data chart.js bug fixed

## [0.0.7] - 2023-05-24
### Bug fix
- moving chart.js to dependencies

## [0.0.6] - 2023-05-24
### Bug fix
- Removed console output

## [0.0.5] - 2023-05-24
### Improvement
- Bar and Histogram component based on ChartJs [`ChartJsBarComponent`, `ChartJsHistogramComponent`]

## [0.0.4] - 2023-05-17
### Bug fix
- Empty data bug fixed

## [0.0.3] - 2023-03-03
### Configuration
- module esnext
- No webpack bundling
- Classes exposed as a library

## [0.0.2] - 2023-03-03
### Configuration
- WebPack `publicPath`

## [0.0.1] - 2022-12-16
### General
- Initial release