import React, {useState, useEffect} from 'react';
import {Link, useParams} from 'react-router-dom';

import TODO from '../todoModule';

import deepClone from '../tools/deepClone';
import objMerge from '../tools/objMerge';

import {bridge, initBridge} from '../components/shared/bridger';
import {showForm, FORM_MODE} from '../components/shared/form/formHandler';

import {sharedState, renderForm, renderMenu, showMenu, listChildren} from '../components/shared/sharedUtils';

export {
    React,
    useState,
    useEffect,
    Link,
    useParams,
    TODO,
    deepClone,
    objMerge,
    bridge,
    initBridge,
    showForm,
    FORM_MODE,
    sharedState,
    renderForm,
    renderMenu,
    showMenu,
    listChildren,
};
