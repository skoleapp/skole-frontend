#!/usr/bin/env node

const request = require('request-promise');
const fs = require('fs');
const { spawn } = require('child_process');

const path = require('path');
const args = require('minimist')(process.argv.slice(2));

const defaultLanguages = ['fi', 'en', 'sv'];

const exampleString = `example: "cli.js --lang=fi,en,sv --apiKey=<LOCALIZE API KEY>`;
const warningApiKey = `You must provide a valid api key`;
const warningLaguageOptions = `You didnt pass any language properties, will default to languages [fi,en,sv]`;

const localesFolder = 'locales';

/** Check of a folder exists **/

const checkDirectory = (directory, callback) => {
  fs.stat(directory, function(err) {
    if (err) {
      fs.mkdir(directory, callback);
    } else {
      callback(err);
    }
  });
};

/** Set argument parser functions **/

const getLanguageKeysFromArguments = argz => {
  if (!argz.lang || argz.lang.split(',').length === 0) {
    console.log(warningLaguageOptions);
    return defaultLanguages;
  }

  return argz.lang.split(',');
};

const getApiKeyFromArguments = argz => {
  if (!argz.apiKey) {
    console.log(warningApiKey);
    process.exit();
  }

  if (typeof argz.apiKey !== 'string' || argz.apiKey.split(',').length !== 1) {
    console.log(warningApiKey);
    process.exit();
  }
  return argz.apiKey.split(',')[0];
};

/** Lets be sure there is a folder to place the locale files to
 Note! check proper async function for this later **/
const createLanguageFolder = lang =>
  new Promise((resolve, reject) => {
    spawn('mkdir', [path.join(__dirname, localesFolder, lang)]);
    setTimeout(() => {
      resolve(lang);
    }, 500);
  });

/** Set constants **/

const LANGUAGE_KEYS = getLanguageKeysFromArguments(args);
const API_KEY = getApiKeyFromArguments(args);

/** Get JSON and write to locales folder **/

const getAllLocales = langKeys =>
  langKeys.map(lang => {
    const options = {
      method: 'GET',
      uri: `https://localise.biz/api/export/locale/${lang}.json?namespace=common&fallback=en`,
      headers: {
        Authorization: `Loco ${API_KEY}`
      },
      json: true
    };
    return request(options).then(async response => {
      const jsonResponse = JSON.stringify(response);

      const langeFolderCreated = await createLanguageFolder(lang);
      const locale_path = path.join(__dirname, localesFolder, langeFolderCreated, `common.json`);

      return fs.writeFile(locale_path, jsonResponse, err => {
        if (err) throw err;
        const message = `language file ${lang} saved!`;
        console.log(message);
        return message;
      });
    });
  });

/** Run the code  **/
const runTheDamnCode = async () => {
  await checkDirectory(path.join(__dirname, localesFolder), () => {
    return Promise.resolve();
  });
  Promise.all(getAllLocales(LANGUAGE_KEYS));
};

runTheDamnCode();
