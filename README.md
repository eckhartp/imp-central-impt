# impt #

*impt* is a command line tool which allows you to interact with the Electric Imp impCloud™ via the [impCentral™ API](https://apidoc.electricimp.com) for the development, testing and deployment of application and factory code, and for device and product management.

*impt* replaces the [*build-cli*](https://github.com/electricimp/build-cli) and [*impTest*](https://github.com/electricimp/impTest) tools, and provides additional functionality.

This guide covers the basic and common usage of *impt*, and should be read first. Depending on your primary activity, you can then find further information in the following documentation:

- [*impt* Development Guide](./DevelopmentGuide.md)
- [*impt* Testing Guide](./TestingGuide.md)
- [*impt* Production Guide](./ProductionGuide.md)
- [*impt* Commands Manual](./CommandsManual.md)

*impt* is written in [Node.js](https://nodejs.org) and uses [Electric Imp’s impCentral API JavaScript library](https://github.com/electricimp/imp-central-api).

## Contents ##

- [Installation](#installation)
- [Proxy Setup](#proxy-setup)
- [Syntax and Command Groups](#syntax-and-command-groups)
- [Help](#help)
- [Debugging](#debugging)
- [Script Support](#script-support)
- [Authentication](#authentication)
- [Login Keys](#login-keys)
- [Projects](#projects)
- [Entity Identification](#entity-identification)
- [Entity Listing and Ownership](#entity-listing-and-ownership)
- [Entity Information](#entity-information)
- [Entity Deletion](#entity-deletion)
- [Non-atomic Transactions](#non-atomic-transactions)
- [Testing](#testing)
- [License](#license)

## Installation ##

*impt* requires [Node.js](https://nodejs.org/en/) version 8 or higher. You can download a Node.js [pre-built binary](https://nodejs.org/en/download/) for your platform, or install Node.js via the [Node Package Manager](https://nodejs.org/en/download/package-manager). Once *node* and *npm* are installed, you need to execute the following command to set up *impt*:

```bash
npm install -g imp-central-impt
```

## Proxy Setup ##

If *impt* is going to connect to the impCentral API via a proxy, one or both of the following environment variables should be set to a value in URL format:
- `HTTPS_PROXY` (or `https_proxy`) &mdash; for the proxy which passes HTTPs requests.
- `HTTP_PROXY` (or `http_proxy`) &mdash; for the proxy which passes HTTP requests.

Note, the default impCentral API endpoint is working over HTTPs.

```
HTTPS_PROXY=https://proxy.example.net
```

## Syntax and Command Groups ##

All commands follow a unified format and [syntax](./CommandsManual.md#command-syntax):

```
impt <command_group> <command_name> [<options>]
```

All commands and options are case sensitive.

The commands are logically divided into groups. Most of the groups directly map to the corresponding groups of the [impCentral API](https://apidoc.electricimp.com) and provide access to its functionality:

- [Product Manipulation Commands](./CommandsManual.md#product-manipulation-commands) &mdash; `impt product <command_name> [<options>]`
- [Device Group Manipulation Commands](./CommandsManual.md#device-group-manipulation-commands) &mdash; `impt dg <command_name> [<options>]`
- [Device Manipulation Commands](./CommandsManual.md#device-manipulation-commands) &mdash; `impt device <command_name> [<options>]`
- [Build (Deployment) Manipulation Commands](./CommandsManual.md#build-manipulation-commands) &mdash; `impt build <command_name> [<options>]`
- [Log Manipulation Commands](./CommandsManual.md#log-manipulation-commands) &mdash; `impt log <command_name> [<options>]`
- [Webhook Manipulation Commands](./CommandsManual.md#webhook-manipulation-commands) &mdash; `impt webhook <command_name> [<options>]`
- [Login Key Manipulation Commands](./CommandsManual.md#login-key-manipulation-commands) &mdash; `impt loginkey <command_name> [<options>]`

A further group of commands covers API access:

- [Authentication Commands](./CommandsManual.md#authentication-commands) &mdash; `impt auth <command_name> [<options>]`

There are two additional groups that include commands for code development and testing:

- [Project Manipulation Commands](./CommandsManual.md#project-manipulation-commands) &mdash; `impt project <command_name> [<options>]`
- [Test Commands](./CommandsManual.md#test-commands) &mdash; `impt test <command_name> [<options>]`

For similar operations in different command groups *impt* uses similar command names, like `create`, `update`, `delete`, `list` and `info`.

The most of commands have optional arguments: `--<options>`. Options may be written in any order. As a general rule, the same option should not be specified multiple times in the same command, but exceptions exist. Some options require values, some do not. If an option value contains spaces it must be placed between double quotes, eg. `--<option> "option value with spaces"`. Some options may accept an empty value, which should be specified as `--<option> ""`.

Every option has a one letter [alias](./CommandsManual.md#list-of-aliases). The aliases are unique for a particular command but may be reused for different options in different commands. The same option in different commands always has the same alias. The options and aliases are detailed in the [Command Description](./CommandsManual.md#command-description).

**Examples**

```
impt product create --name TestProduct --descr "My test product"
```

```
impt product update --product TestProduct -s ""
```

```
impt dg create --name "TestDG" -y development -p TestProduct
```

```
impt device assign -g TestDG -d myDevice1
```

## Help ##

Every command has a `--help` option (alias: `-h`). If it is specified, any other specified options are ignored. The command is not executed but the tool displays full description of the command &mdash; the format, explanation and options.

The [help option](./CommandsManual.md#the-help-option) is applicable to a partially specified command, but also may be used to list all available command groups or to list all commands available in one group.

**Examples**

**List all command groups**

```
> impt --help

Usage: impt <command> [options]

Commands:
  impt auth      Authentication commands.
  impt build     Build manipulation commands.
  impt device    Device manipulation commands.
  impt dg        Device Group manipulation commands.
  impt log       Logs manipulation commands.
  impt loginkey  Login Key manipulation commands.
  impt product   Product manipulation commands.
  impt project   Project manipulation commands.
  impt test      Test manipulation commands.
  impt webhook   Webhook manipulation commands.

Options:
  --help, -h  Displays description of the command. Ignores any other options.
                                                                       [boolean]
```

**List all commands in one group**

```
> impt product --help

Usage: impt product <command> [options]

Product manipulation commands.

Commands:
  impt product create  Creates a new Product.
  impt product delete  Deletes the specified Product.
  impt product info    Displays information about the specified Product.
  impt product list    Displays information about all or filtered Products.
  impt product update  Updates the specified Product.

Options:
  --help, -h  Displays description of the command. Ignores any other options.
                                                                       [boolean]
```

**Display a command description**

```
> impt product create --help

Usage: impt product create --name <product_name> [--descr <product_description>]
[--debug] [--help]

Creates a new Product. Fails if Product with the specified Name already exists.

Options:
  --help, -h   Displays description of the command. Ignores any other options.
                                                                       [boolean]
  --name, -n   Name of the Product. Must be unique among all Products owned by
               the logged-in account.                        [string] [required]
  --descr, -s  Description of the Product.                              [string]
  --debug, -z  Displays debug info of the command execution.           [boolean]
```

## Debugging ##

Every command has a `--debug` option (alias: `-z`). If it is specified, the tool displays debug information from the command being executed, including impCentral API requests and responses.

**Example**

```
> impt product create --name TestProduct --descr "My test product" --debug
Doing the request with options:
{
  "url": "https://api.electricimp.com/v5/products",
  "method": "POST",
  "headers": {
    "Content-type": "application/vnd.api+json",
    "Authorization": "[hidden]"
  },
  "json": true,
  "qs": null,
  "body": {
    "data": {
      "type": "product",
      "attributes": {
        "name": "TestProduct",
        "description": "My test product"
      }
    }
  },
  "qsStringifyOptions": {
    "arrayFormat": "repeat"
  }
}

Response code: 201
Response headers: {
  "date": "Sun, 21 Jan 2018 21:40:22 GMT",
  "content-type": "application/vnd.api+json",
  "content-length": "477",
  "connection": "close",
  "server": "nginx/1.4.6 (Ubuntu)",
  "content-language": "en",
  "x-node": "api03",
  "accept": "application/vnd.api+json",
  "x-ratelimit-limit": "40",
  "x-ratelimit-reset": "1",
  "x-ratelimit-remaining": "39",
  "strict-transport-security": "max-age=1209600"
}
Response body: {
  "data": {
    "type": "product",
    "id": "91f2e41a-3c5c-00bf-1ddd-1c0a2fdbeadd",
    "links": {
      "self": "https://api.electricimp.com/v5/products/91f2e41a-3c5c-00bf-1ddd-1c0a2fdbeadd"
    },
    "attributes": {
      "name": "TestProduct",
      "description": "My test product",
      "created_at": "2018-01-21T21:40:22.631Z",
      "updated_at": "2018-01-21T21:40:22.631Z"
    },
    "relationships": {
      "owner": {
        "type": "account",
        "id": "c1d61eef-d544-4d09-c8dc-d43e6742cae3"
      },
      "creator": {
        "type": "account",
        "id": "c1d61eef-d544-4d09-c8dc-d43e6742cae3"
      }
    }
  }
}
Product "TestProduct" is created successfully.
IMPT COMMAND SUCCEEDS
```

## Script Support ##

The tool’s commands are designed to enable friendly processing by scripts.

Interaction with a user is minimal. Only a few commands, such as [delete](#entity-deletion), ask for a confirmation from the user. But all of these commands support the `--confirmed` option (alias: `-q`). If this option is specified, the command is executed without requiring confirmation from the user. Scripts can use this option.

A command’s execution output contains one of the two predefined phrases: `IMPT COMMAND SUCCEEDS` or `IMPT COMMAND FAILS`. Scripts can parse a command’s output to find these standard phrases to detect whether the commmand succeeded or failed. If any command fails, `IMPT COMMAND FAILS` is always the last line of the command’s output. If a command succeeds, `IMPT COMMAND SUCCEEDS` phrase is the last line of the output for the most of the commands. Logging-related commands may have additional `IMPT COMMAND SUCCEEDS` phrases in their output. If the [help option](./CommandsManual.md#the-help-option) is specified for a command, its output does not contain either predefined phrase.

If a command finishes with `IMPT COMMAND FAILS`, it returns non-zero exit code. Otherwise, it returns zero exit code. This can be used by scripts as well.

**Example**

**A successful command execution**

```
> impt product delete --product TestProduct --confirmed
Product "TestProduct" is deleted successfully.
IMPT COMMAND SUCCEEDS
```

**A failed command execution**

```
> impt product delete --product TestProduct --confirmed
ERROR: Product "TestProduct" is not found.
IMPT COMMAND FAILS
```

## Authentication ##

Calls to the impCentral API need to be authenticated. *impt* provides the [login command](./CommandsManual.md#auth-login) for this purpose. It can be used in either of two ways:

- Using an account identifier (an email address or a username) and password: `impt auth login --user <user_id> --pwd <password>`
  - NOTE: If your username or password contains certain special characters, such as the "!", you may need to wrap the `user_id` and `password` in single quotes to avoid [potential bash interpretation issues](https://ss64.com/bash/bang.html) (e.g. `impt auth login --user 'AUserId' --pwd 'A!Password'`)
- Using a [login key](#login-keys): `impt auth login --lk <login_key>`

The tool takes care of obtaining an access token and refreshing it using an obtained refresh token or a provided login key. Typically, you need only log in once and can continue using the tool while the refresh token or login key remains valid (ie. not deleted by you). For this purpose, the tool stores the access token and the refresh token/login key in an [auth file](./CommandsManual.md#auth-files).

*impt* never stores an account identifier and password. If you do not want the tool to store a refresh token/login key, use the [login command’s](./CommandsManual.md#auth-login) `--temp` option. In this case you will not be able to work with the impCentral API after the access token has expired (usually one hour after issue), and you will have to log in again to continue.

At any time, you can call the [logout command](./CommandsManual.md#auth-logout), `impt auth logout`, to delete the [auth file](./CommandsManual.md#auth-files). Usually you will not be able to work with the impCentral API after logging out and will have to log in again to continue working, but see the explanation about global and local login/logout below.

You do not need to use the logout command if you want just to re-login using other credentials. A new login command overwrites the [auth file](./CommandsManual.md#auth-files), if it exists and the operation is confirmed by the user.

During login, you can specify an alternative impCentral API endpoint using the [login command’s](./CommandsManual.md#auth-login) `--endpoint` option (alias: `-e`). You may need this if you work with a Private impCloud. The default endpoint is `https://api.electricimp.com/v5`.

### Global and Local Authentication ###

There are two types of login: global and local.

- Global login is the default. It is sufficient to use if you always work on behalf of the same user with the same impCentral
API endpoint. A [global auth file](./CommandsManual.md#global-auth-file) &mdash; only one per *impt* installation &mdash; is created for the global login. Every *impt* command is executed in the context of the global login when a local login is not applicable.

- Local login works for a particular directory. It may be convenient if you often work on behalf of different users or use different impCentral API endpoints. In this case, you may choose a directory and in this directory call the [login command](./CommandsManual.md#auth-login) with the `--local` option (alias: `-l`). If the authentication is successful, a [local auth file](./CommandsManual.md#local-auth-file) is created in the directory. After that, every *impt* command called from this directory is executed in the context of the local login.

There can be only one [local auth file](./CommandsManual.md#local-auth-file) in a directory, but any number of directories with local auth files, ie. any number of local logins. And all of them are independent of each other and of the [global auth file](./CommandsManual.md#global-auth-file). You do not need to have the global login in order to use local logins. Note, that local auth file affects the current directory only and does not affect any sub-directories &mdash; they may or may not contain their own local auth files.

If you run the [logout command](./CommandsManual.md#auth-logout) with the `--local` option, it deletes the [local auth file](./CommandsManual.md#local-auth-file), if it exists in the current directory. After that, any subsequent command called from this directory will be executed in the context of the global login. Calling the [logout command](./CommandsManual.md#auth-logout) without the `--local` option deletes the [global auth file](./CommandsManual.md#global-auth-file).

### Summary of the *impt* Command Execution Context ###

- If the current directory contains an auth file, this file is considered the [local auth file](./CommandsManual.md#local-auth-file) and a command called from this directory is executed in the context of the local login defined by this file.
- Otherwise, if a [global auth file](./CommandsManual.md#global-auth-file) exists, a command is executed in the context of the global login defined by that file.
- Otherwise, a command fails (global or local login is required).

At any time you can get known the login status related to any directory. Call the [`impt auth info`](./CommandsManual.md#auth-info) from the required directory. The returned information includes a type of the login applicable to the current directory, access token status, your account ID and other details.

**Examples**

**Global login**

```
> impt auth login --user username --pwd password
Global login is successful.
IMPT COMMAND SUCCEEDS
```

**Local login using a login key, specifying a endpoint, without storing the login key**

```
> impt auth login --local --lk 7d8e6670aa285e9d --temp --endpoint https://api.electricimp.com/v5
Local login is successful.
IMPT COMMAND SUCCEEDS
```

**Display login status**

```
> impt auth info
Auth info:
impCentral API endpoint:   https://api.electricimp.com/v5
Auth file:                 Local
Access token auto refresh: false
Access token:              expires in 59 minutes
Username:                  username
Email:                     user@email.com
Account id:                c1d61eef-d544-4d09-c8dc-d43e6742cae3
IMPT COMMAND SUCCEEDS
```

**Local logout**

```
> impt auth logout --local
Local logout is successful.
IMPT COMMAND SUCCEEDS
```

## Login Keys ##

*impt* provides a set of [Login Key manipulation commands](./CommandsManual.md#login-key-manipulation-commands) which allows you to fully control your account’s login keys: list the existent login keys, create a new one, delete one, etc. You must be logged in in order to use the commands, which may additionally requires your password.

**Example**

```
> impt loginkey list
Login Key list (1 items):
Login Key:
  id:     7d8e6670aa285e9d
  usages: 1
IMPT COMMAND SUCCEEDS
```

## Projects ##

A Project is an *impt* entity introduced to help developers manage their work. A Project is any directory containing a [project File](./CommandsManual.md#project-files). One Project references one Device Group.

Projects are intended for developers and are described in detail in the [*impt* Development Guide](./DevelopmentGuide.md). The tool provides a set of [Project manipulation commands](./CommandsManual.md#project-manipulation-commands). However, many other commands are affected when called from a directory where a [Project file](./CommandsManual.md#project-files) is located. Product, Device Group, Devices, Deployment referenced by the Project file may be assumed by a command when they are not specified in the command’s options explicitly. If you want to avoid that, always specify the mandatory options of the commands. All such options are detailed in the [Command Description](./CommandsManual.md#command-description).

**Example**

**Unassign all Devices from Device Group** 

A Device Group is not specified in the command below, but the current directory contains a Project File. All Devices are unassigned from the Device Group referenced by that Project File.

```
> impt dg unassign
The following Devices are unassigned successfully from Device Group "dfcde3bd-3d89-6c75-bf2a-a543c47e586b":
Device:
  id:            234776801163a9ee
  name:          myDevice1
  mac_address:   0c:2a:69:05:0d:62
  agent_id:      T1oUmIZ3At_N
  device_online: true
Device:
  id:            23522f6938a609ee
  name:          myDevice2
  mac_address:   0c:2a:69:03:ea:f0
  agent_id:      5t0B6z6c4nHF
  device_online: true
IMPT COMMAND SUCCEEDS
```

## Entity Identification ##

Many *impt* commands have options which specify an impCentral API entity &mdash; a concrete Product, Device Group, Device or Deployment, etc. You can use an entity ID (Product ID, Device Group ID, etc.) as that is always unique. But sometime it may be more convenient to use other attributes to specify an entity. For example, Product name, Device Group name, device MAC address, device agent ID, build SHA, build tag, etc. *impt* allows you to do this. You can specify different attributes as an option value and the tool searches for the specified value among different attributes.

If you want to use this feature, please read the [Commands Manual](./CommandsManual.md#entity-identification) first. It contains the rules governing how the tool searches an entity, and the lists of attributes acceptable for different entities. Command options, to which the complex entity identification is applicable, are detailed in the [Command Description](./CommandsManual.md#command-description). Note that if more than one entity is found, then, depending on a particular command, it may be considered as a success (for all [Entity Listing](#entity-listing-and-ownership) commands) or as a fail (for all other commands).

When it is hard to uniquely specify an entity without knowing the entity ID, use [entity listing](#entity-listing-and-ownership) commands to view the entities basing on some attributes, choose the required entity and use its entity ID in the required command.

**Examples**

**An entity is found successfully**

```
> impt device info --device 0c:2a:69:05:0d:62
Device:
  id:                      234776801163a9ee
  name:                    myDevice1
  agent_id:
  agent_url:
  device_online:           true
  device_state_changed_at: 2018-01-21T22:08:53.017Z
  agent_running:           false
  agent_state_changed_at:
  last_enrolled_at:        2018-01-19T14:15:39.247Z
  imp_type:                imp001
  ip_address:              93.80.11.190
  mac_address:             0c:2a:69:05:0d:62
  free_memory:             84720
  rssi:                    -51
  swversion:               1ae4c87 - release-36.13 - Wed Dec 20 10:52:30 2017 - production
  plan_id:
IMPT COMMAND SUCCEEDS
```

**An entity is not unique, so the command fails**

```
> impt build info --build MyRC1
ERROR: Multiple Deployments "MyRC1" are found:
Deployment:
  id:           24aa0e91-ebc0-9198-090c-44cca8b977f3
  sha:          4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05
  tags:         MyRC1
  flagged:      true
  Device Group:
    id:   da27eb09-61d7-100b-095e-47578bada966
    type: pre-production
    name: MyPreProductionDG
Deployment:
  id:           bf485681-37c3-a813-205a-e90e19b1a817
  sha:          4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05
  tags:         MyRC1
  flagged:      true
  Device Group:
    id:   dfcde3bd-3d89-6c75-bf2a-a543c47e586b
    type: development
    name: MyDevDG
Impossible to execute the command.
IMPT COMMAND FAILS
```

## Entity Listing and Ownership ##

Many groups of commands contain a command to list entities: [Products](./CommandsManual.md#product-list), [Device Groups](./CommandsManual.md#device-group-list), [Devices](./CommandsManual.md#device-list), [Builds](./CommandsManual.md#build-list) and [WebHooks](./CommandsManual.md#webhook-list). By default, such a command returns the list of all entities available to the current (ie. logged in) account. But the returned list may be filtered using filter options. These are the common rules applicable to all list commands:

- Every filter option may be repeated several times.
- At first, all filter options with the same name are combined by logical OR.
- After that, all filter options with different names are combined by logical AND.

Some filter options have the same name and meaning across list commands. They are summarized [here](./CommandsManual.md#common-filter-options). A particular command may have specific filter options too. Filter options applicable to every concrete list command are detailed in the [Command Description](./CommandsManual.md#command-description).

For some list commands, the default returned list includes entities owned by the current account as well as entities owned by collaborators. For other list commands, only the entities owned by the current account are returned. This is impCentral API-specific behavior not controlled by *impt*. But you can always specify a concrete Account ID, email or username as a value of the `--owner <value>` filter option (alias: `-o`) and get the entities owned by that account, if they are available to you as to a collaborator. Also, you can always specify the `--owner me` filter option and get the entities owned by you only.

As a general rule, if an entity is owned by the current logged-in account, information about Owner is not displayed. If an entity is owned by another account, then Account ID and email of the Owner are displayed for the entity. This rule applies to all *impt* commands which display details of an entity: entity listing, [entity information](#entity-information) and other.

To display the Account ID and email of the current account, use [`impt auth info`](./CommandsManual.md#auth-info).

**Example**

**List all Products owned by me and my collaborators**

```
> impt product list
impt product list
Product list (4 items):
Product:
  id:   30f19176-2b38-838d-62fd-38f5f3602ea4
  name: MyProduct
Product:
  id:    c4e006ed-85b9-3513-fa99-0700333c3ad7
  name:  MyProduct
  Owner:
    id:    c1d61eef-d544-4d09-c8dc-d43e6742cae3
    email: user@email.com
Product:
  id:   885dfd24-e8f6-0621-32fc-556d24ed4cab
  name: SmartFridge
Product:
  id:    2390fed8-d14c-cd55-2176-30e370b23519
  name:  TestProduct
  Owner:
    id:    c1d61eef-d544-4d09-c8dc-d43e6742cae3
    email: user@email.com
IMPT COMMAND SUCCEEDS
```

**List all Factory Device Groups owned by the specified account**

```
> impt dg list --owner user@email.com --dg-type pre-factory --dg-type factory
Device Group list (2 items):
Device Group:
  id:      3fad5031-8b4e-da7a-dee3-df410e06bb5f
  type:    pre-factory
  name:    MyPreFactoryDG
  Product:
    id:   c4e006ed-85b9-3513-fa99-0700333c3ad7
    name: MyProduct
  Owner:
    id:    c1d61eef-d544-4d09-c8dc-d43e6742cae3
    email: user@email.com
Device Group:
  id:      b26aae4c-92d7-7e60-7c71-3fe2486e352f
  type:    factory
  name:    MyFactoryDG
  Product:
    id:   ffa85f81-83a7-ae85-d571-8875b3bd29d6
    name: MyFactoryProduct
  Owner:
    id:    c1d61eef-d544-4d09-c8dc-d43e6742cae3
    email: user@email.com
IMPT COMMAND SUCCEEDS
```

**List all Device Groups owned by me and belonged to the specified Products**

```
> impt dg list --owner me --product MyProduct --product TestProduct
Device Group list (4 items):
Device Group:
  id:      bbe4605c-6464-ad89-7745-78579c4705f7
  type:    development
  name:    MyDevDG
  Product:
    id:   c4e006ed-85b9-3513-fa99-0700333c3ad7
    name: MyProduct
Device Group:
  id:      3fad5031-8b4e-da7a-dee3-df410e06bb5f
  type:    pre-factory
  name:    MyPreFactoryDG
  Product:
    id:   c4e006ed-85b9-3513-fa99-0700333c3ad7
    name: MyProduct
Device Group:
  id:      da27eb09-61d7-100b-095e-47578bada966
  type:    pre-production
  name:    MyPreProductionDG
  Product:
    id:   c4e006ed-85b9-3513-fa99-0700333c3ad7
    name: MyProduct
Device Group:
  id:      3667ed96-12cd-ea20-9c09-0b2f32d1f73b
  type:    development
  name:    TestDG
  Product:
    id:   2390fed8-d14c-cd55-2176-30e370b23519
    name: TestProduct
IMPT COMMAND SUCCEEDS
```

## Entity Information ##

Most command groups contain the `info` command, which displays information about the specified entity. Some of that commands have a `--full` option (alias: `-u`). When it is specified, the command displays additional details about the related entities. For example, `impt product info --full` displays the full structure of the Product: details about every Device Group that belongs to the Product, and about devices assigned to the Device Groups.

**Example**

```
> impt product info --product MyProduct --full
Product:
  id:            c4e006ed-85b9-3513-fa99-0700333c3ad7
  name:          MyProduct
  description:
  created_at:    2018-01-21T22:07:59.711Z
  updated_at:    2018-01-21T22:07:59.711Z
  Device Groups:
    Device Group:
      id:                       dfcde3bd-3d89-6c75-bf2a-a543c47e586b
      type:                     development
      name:                     MyDevDG
      Current Deployment:
        id:      bf485681-37c3-a813-205a-e90e19b1a817
        sha:     4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05
        tags:    MyRC1
        flagged: true
      Min supported Deployment:
        id:  6dfda2e3-20c9-d6aa-259e-a25bff906af5
        sha: a2a40343f62f172a873ecffd99e741e0cc2107b4c3bae38445baa31bec11d8b5
      Devices:
        Device:
          id:            234776801163a9ee
          name:          myDevice1
          mac_address:   0c:2a:69:05:0d:62
          agent_id:      T1oUmIZ3At_N
          device_online: true
IMPT COMMAND SUCCEEDS
```

## Entity Deletion ##

By default, commands which delete impCentral entities (eg. Product, Device Group, Deployment) have the same limitations as the corresponding impCentral API functionality. For example, a Product deletion fails if the Product contains one or more Device Groups; a build (Deployment) fails if the Deployment has the *flagged* attribute set to `true`. If you specify the delete command’s `--force` option (alias: `-f`), the tool implicitly deletes all dependent entities in order to delete the target entity. For example, the tool deletes all Device Groups of the Product in order to delete the Product; if necessary, the tool updates each Deployment’s *flagged* attribute in order to delete the Deployment.

By default, every delete command asks a confirmation of the operation from user. Before that the command lists all the entities which are to be deleted or updated. If you specify the `--confirmed` option (alias: `-q`), the operation is executed without requesting confirmation from the user.

**Example**

**A failed delete command execution**

```
> impt dg delete --dg MyDevDG --confirmed
ERROR: Flagged Deployments Exist: Cannot delete a devicegroup with flagged deployments; delete those first.
IMPT COMMAND FAILS
```

**A successful delete command execution**

```
> impt dg delete --dg MyDevDG --force
The following entities will be deleted:
Device Group:
  id:   dfcde3bd-3d89-6c75-bf2a-a543c47e586b
  type: development
  name: MyDevDG

The following Deployments are marked "flagged" to prevent deleting. They will be modified
by setting "flagged" attribute to false:
Deployment:
  id:      bf485681-37c3-a813-205a-e90e19b1a817
  sha:     4e7f3395e86658ab39a178f9fe4b8cd8244a8ade92cb5ae1bb2d758434174c05
  tags:    MyRC1
  flagged: true

Are you sure you want to continue?
Enter 'y' (yes) or 'n' (no): y

Deployment "bf485681-37c3-a813-205a-e90e19b1a817" is updated successfully.
Device Group "MyDevDG" is deleted successfully.
IMPT COMMAND SUCCEEDS
```

## Non-atomic Transactions ##

Many *impt* commands combine several impCentral API requests which change impCentral API entities (like update, delete, etc.) to perform one operation. *impt* does its best to pre-check all conditions before starting every operation. At the same time, it does not guarantee an operation is atomic. It is always possible that the first impCentral API update request succeeds but the next one fails, if the connection is lost, for example. In this case, the operation is partially completed, *impt* does not restore the original state of already changed entities, and the command reports a failure. You can check an actual state of any impCentral entity using [entity information](#entity-information) commands.

## Testing ##

There are [Jasmine](https://www.npmjs.com/package/jasmine) tests available to verify *impt* implementation itself. [Testing readme file](./spec/TestingReadme.md) describes how to run the tests and extend them, if necessary.

## License ##

*impt* is licensed under the [MIT License](./LICENSE)
