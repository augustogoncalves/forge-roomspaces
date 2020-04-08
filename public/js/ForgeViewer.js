/////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Forge Partner Development
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////

var viewer;

function launchViewer(urn) {
  var options = {
    env: 'AutodeskProduction',
    getAccessToken: getForgeToken
  };

  Autodesk.Viewing.Initializer(options, () => {
    viewer = new Autodesk.Viewing.GuiViewer3D(document.getElementById('forgeViewer'), { extensions: ['Autodesk.DocumentBrowser'] });
    viewer.start();
    var documentId = 'urn:' + urn;
    Autodesk.Viewing.Document.load(documentId, onDocumentLoadSuccess, onDocumentLoadFailure);
  });
}

function onDocumentLoadSuccess(doc) {
  findMasterView(doc.getRoot().findAllViewables()[0], (viewables) => {
    viewer.loadDocumentNode(doc, viewables).then(i => {
      // documented loaded, any action?
    });
  });
}

// Yet to confirm if is safe to assume that Master View will be named
// according to the phase it represents.
function findMasterView(viewable, callback) {
  if (viewable.isLeaf && (viewable.data.name === viewable.data.phaseNames)) {
    console.log('Name: ' + viewable.data.name);
    console.log('Phase: ' + viewable.data.phaseNames);
    if (callback) callback(viewable);
  }
  if (viewable.children === undefined) return;
  viewable.children.forEach((c) => {
    findMasterView(c, callback)
  })
}

function onDocumentLoadFailure(viewerErrorCode) {
  console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode);
}

function getForgeToken(callback) {
  fetch('/api/forge/oauth/token').then(res => {
    res.json().then(data => {
      callback(data.access_token, data.expires_in);
    });
  });
}

$(document).ready(function () {
  launchViewer('dXJuOmFkc2sub2JqZWN0czpvcy5vYmplY3Q6bHNndW5hMXdkY3ppaGd6MmtiM2RsZ2d0ejh5a2w2bnAtbWFzdGVydmlldy9ybWVfYWR2YW5jZWRfc2FtcGxlX3Byb2plY3QucnZ0');
});