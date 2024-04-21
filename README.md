# Fullstack-app-Waby

[![Netlify Status](https://api.netlify.com/api/v1/badges/a7614be9-0d4a-4a3b-a3b4-c704a0d3428f/deploy-status)](https://app.netlify.com/sites/waby/deploys)

## Link sitio

<a href = 'https://waby.netlify.app/'>Waby</a>

### Comandos GIT Flow

###### You'll have to answer a few questions regarding the naming conventions for your branches. It's recommended to use the default values.

```shell
git flow init
```

<hr>

### Features

###### Develop new features for upcoming releases. Typically exist in developers repos only.

##### Start a new feature:

###### This action creates a new feature branch based on 'develop' and switches to it.

```
git flow feature start MYFEATURE
```

##### Finish up a feature:

###### Finish the development of a feature. This action performs the following:

###### 1) Merged MYFEATURE into 'develop'.

###### 2) Removes the feature branch.

###### 3) Switches back to 'develop' branch

```
git flow feature finish MYFEATURE
```

##### Publish a feature:

###### Are you developing a feature in collaboration? Publish a feature to the remote server so it can be used by other users.

```
git flow feature publish MYFEATURE
```

##### Getting a published feature:

###### Get a feature published by another user.

```
git flow feature pull origin MYFEATURE
```

##### Tracking a origin feature:

###### You can track a feature on origin by using

```
git flow feature track MYFEATURE
```

<hr>

### Make a Release

###### Support preparation of a new production release. Allow for minor bug fixes and preparing meta-data for a release

##### Start a release:

###### To start a release, use the git flow release command. It creates a release branch created from the 'develop' branch. You can optionally supply a [BASE] commit sha-1 hash to start the release from. The commit must be on the 'develop' branch.

```
git flow release start RELEASE [BASE]
```

###### It's wise to publish the release branch after creating it to allow release commits by other developers. Do it similar to feature publishing with the command:

```
git flow release publish RELEASE
```

###### (You can track a remote release with the: `git flow release track RELEASE` command)

##### Finish up a release:

###### Finishing a release is one of the big steps in git branching. It performs several actions:

###### 1) Merges the release branch back into 'master'

###### 2) Tags the release with its name

###### 3) Back-merges the release into 'develop'

###### 4) Removes the release branch

```
git flow release finish RELEASE
```

###### Don't forget to push your tags with `git push --tags`

<hr>

### Hotfixes

###### Hotfixes arise from the necessity to act immediately upon an undesired state of a live production version. May be branched off from the corresponding tag on the master branch that marks the production version.

##### Git flow hotfix start:

###### Like the other git flow commands, a hotfix is started with

```
$ git flow hotfix start VERSION [BASENAME]
```

###### The version argument hereby marks the new hotfix release name. Optionally you can specify a basename to start from.

##### Finish a hotfix:

###### By finishing a hotfix it gets merged back into develop and master. Additionally the master merge is tagged with the hotfix version

```
git flow hotfix finish VERSION
```

<hr>

### Commands

<p align="center">
    <img alt="Git" src="./Img/git-flow-commands.png" height="270" width="460">
</p>
<hr>

### Git flow schema

<p align="center">
    <img alt="Git" src="Img/git-flow-commands-without-flow.png">
</p>
<hr>
