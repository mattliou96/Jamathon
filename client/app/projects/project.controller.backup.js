(function () {

    'use strict';

    angular
        .module('Jamathon')
        .controller('ProjectCtrl', ProjectCtrl);

    ProjectCtrl.$inject = ['ProjectSvc', 'Upload', '$scope'];

    function ProjectCtrl(ProjectSvc, Upload, $scope) {

        var vm = this;
        //line 14-26 is original upload function for project
        vm.upload = upload;

        function upload(ProjectSvc) {
            // TO DO: call your service
            ProjectSvc.upload(sequencer.project.state.activeProject.Tracks)
                .then(function (result) {

                })
                .catch(function (err) {

                });
        };
        //line 28-84 is S3 Upload function
        vm.audFile = null;
        vm.audFileS3 = null;
        vm.statusS3 = {
            message: "",
            code: 0
        };
        vm.comment = "";
        vm.commentS3 = "";
        vm.projectName = "";
        vm.status = {
            message: "",
            code: 0
        };

        // Exposed functions
        vm.upload = upload;
        vm.uploadS3 = uploadS3;

        // -------------------------
        // File upload function using ng-file-upload
        function upload() {
            // Upload configuration and invokation 
            Upload.upload({
                url: '/upload',
                data: {
                    "aud-file": vm.audFile,
                    "comment": vm.comment
                }
            }).then(function (result) {
                vm.status.message = "The song is saved successfully in: " + result.data.path;
                vm.status.code = 202;
            }).catch(function (err) {
                console.log(err);
                vm.status.message = "Fail to save the song.";
                vm.status.code = 400
            });

        };
        function uploadS3() {
            // Upload configuration and invocation 
            console.log("hey");

            Upload.upload({
                url: '/uploadS3',
                data: {
                    "aud-file": vm.audFileS3,
                    "description": vm.commentS3,
                    "projectName": vm.projectName,
                }
            }).then(function (result) {
                vm.statusS3.message = "The song is saved successfully in: " + result.data.path;
                vm.statusS3.code = 202;
                vm.audioFromS3 = result.data.path;
            }).catch(function (err) {
                console.log(err);
                vm.statusS3.message = "Fail to save the song.";
                vm.statusS3.code = 400
            });

        };

        window.URL = window.URL || window.webkitURL;

        // // audio context + .createScriptProcessor shim
         var audioContext = new AudioContext;
        //  var input = audioContext.createGain();

        // if (audioContext.createScriptProcessor == null)
        //     audioContext.createScriptProcessor = audioContext.createJavaScriptNode;

        // // // elements (jQuery objects)
        var $testToneLevel = $('#test-tone-level'),
            $microphone = $('#microphone'),
            $microphoneLevel = $('#microphone-level'),
            $encodingProcess = $('input[name="encoding-process"]'),
            $bufferSize = 1,
            $recording = $('#recording'),
            $timeDisplay = $('#time-display'),
            $record = $('#record'),
            $cancel = $('#cancel'),
            $dateTime = $('#date-time'),
            $recordingList = $('#recording-list');


        // // initialize input element states (required for reloading page on Firefox)
        //     // $testToneLevel.attr('disabled', false);
        //     // $testToneLevel[0].valueAsNumber = 0;
        //     // $microphone.attr('disabled', false);
        //     // $microphone[0].checked = false;
        //     // $microphoneLevel.attr('disabled', false);
        //     // $microphoneLevel[0].valueAsNumber = 0;
        //     // $encodingProcess.attr('disabled', false);
        //     // $encodingProcess[0].checked = true;
        //     // $bufferSize.attr('disabled', false);



        // // processor buffer size
        //  var BUFFER_SIZE = [256, 512, 1024, 2048, 4096, 8192, 16384];
        //  var testToneLevel = audioContext.createGain(),
        //     microphone = undefined,     // obtained by user click
        //     microphoneLevel = audioContext.createGain(),
        //     mixer = audioContext.createGain(),
        //     input = audioContext.createGain(),
        //     processor = undefined;      // created on recording
        //  var defaultBufSz = (function () {
        //     processor = audioContext.createScriptProcessor(undefined, 2, 2);
        //      return processor.bufferSize;
        //  })();

        //  var iDefBufSz = BUFFER_SIZE.indexOf(defaultBufSz);
        // // console.log($bufferSize);
        // // console.log($bufferSize[0]);
        // // $bufferSize[0].valueAsNumber = iDefBufSz;   // initialize with browser default

        // function updateBufferSizeText() {
        //     var iBufSz = $bufferSize,
        //         text = "" + BUFFER_SIZE[iBufSz];
        //     if (iBufSz === iDefBufSz)
        //         text += ' (browser default)';
        //     $('#buffer-size-text').html(text);
        // }

        // updateBufferSizeText();         // initialize text

        // //$bufferSize.on('input', function () { updateBufferSizeText(); });
        var encoder = undefined;
        var processor = undefined;
        // // // save/delete recording
        function saveRecording(blob) {
            var time = new Date(),
                url = URL.createObjectURL(blob),
                html = "<p recording='" + url + "'>" +
                    "<audio controls src='" + url + "'></audio> " +
                    time +
                    " <a class='btn btn-default' href='" + url +
                    "' download='recording.wav'>" +
                    "Save...</a> " +
                    "<button class='btn btn-danger' recording='" +
                    url + "'>Delete</button>" +
                    "</p>";
            console.log(url);
            $recordingList.prepend($(html));
        }
        // //replace line 128-133 with ng-click in view
        // $recordingList.on('click', 'button', function (event) {
        //     var url = $(event.target).attr('recording');
        //     $("p[recording='" + url + "']").remove();
        //     URL.revokeObjectURL(url);
        // });

        // function recordingList (event) {
        //     var url = $(event.target).attr('recording');
        //     $("p[recording='" + url + "']").remove();
        //     URL.revokeObjectURL(url);
        // }

        function getBuffers(event) {
            var buffers = [];
            for (var ch = 0; ch < 2; ++ch)
                buffers[ch] = event.inputBuffer.getChannelData(ch);
            return buffers;
        }

        // var encodingProcess = 'direct';
        // var encoder;
        var BUFFER_SIZE = [256, 512, 1024, 2048, 4096, 8192, 16384];

        function startRecordingProcess(audioContext) {
            var bufSz = BUFFER_SIZE[$bufferSize];
            processor = audioContext.createScriptProcessor(bufSz, 2, 2);
            //input.connect(processor);
            processor.connect(audioContext.destination);

            encoder = new WavAudioEncoder(audioContext.sampleRate, 1);
            processor.onaudioprocess = function (event) {

                encoder.encode(getBuffers(event));
            };
        }

     

        function stopRecordingProcess(finish) {
            //input.disconnect();
            processor.disconnect();
            if (finish)
                saveRecording(encoder.finish());
            else
                encoder.cancel();
        }

        var startTime = null

        function minSecStr(n) { return (n < 10 ? "0" : "") + n; }

        function updateDateTime() {
            $dateTime.html((new Date).toString());
            if (startTime != null) {
                var sec = Math.floor((Date.now() - startTime) / 1000);
                $timeDisplay.html(minSecStr(sec / 60 | 0) + ":" + minSecStr(sec % 60));
            }
        }

        // window.setInterval(updateDateTime, 200);

        // // function disableControlsOnRecord(disabled) {
        // //     if (microphone == null)
        // //         $microphone.attr('disabled', disabled);
        // //     $bufferSize.attr('disabled', disabled);
        // //     $encodingProcess.attr('disabled', disabled);
        // // }

        function startRecording(audioContext) {
            startTime = Date.now();
            $recording.removeClass('hidden');
            $record.html('STOP');
            $cancel.removeClass('hidden');
            // disableControlsOnRecord(true);
            if (audioContext.createScriptProcessor == null)
                audioContext.createScriptProcessor = audioContext.createJavaScriptNode;
            startRecordingProcess(audioContext);
        }

        function stopRecording(finish) {
            startTime = null;
            $timeDisplay.html('00:00');
            $recording.addClass('hidden');
            $record.html('RECORD');
            $cancel.addClass('hidden');
            // disableControlsOnRecord(false);
            stopRecordingProcess(finish);
        }


        // $cancel.click(function () { stopRecording(false); });


        // Create Namespaces
        var sequencer = {},
            utils = {};

        /**
         * Project Data
         * @type {{}}
         */
        sequencer.project = {};
        /**
         * Project States
         * @type {{}}
         */
        sequencer.project.state = {};
        sequencer.project.state.activeTrack = null; // NOT USED YET
        sequencer.project.state.activeNote = null;
        sequencer.project.state.activeProject = null;
        sequencer.project.state.loopTimer = null;

        /**
         * Project Configuration
         * @type {{author: string, title: string, bpm: number}}
         */
        sequencer.project.config = {
            author: 'Unknown',
            title: 'Untitled',
            bpm: 120
        };


        /**
         * Network related utilities and data loaders
         * @type {{}}
         */
        utils.net = {};
        /**
         * Loads Sequence Data from URL
         * @param sequenceURI URI of the project resource to load
         * @param callback function to handle response data
         */
        utils.net.loadSequence = function (sequenceURI, callback) {
            var xhr = new XMLHttpRequest();
            xhr.overrideMimeType("application/json");
            xhr.open('GET', sequenceURI, true);
            xhr.addEventListener('error', function () {
                // TODO: Handle Error
            });
            xhr.addEventListener('load', function () {
                callback(xhr.responseText);
            });
            xhr.send(null);
        };

        /**
         *
         * @param sampleURI
         * @param callback
         */
        utils.net.loadSample = function (sampleURI, callback) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', sampleURI, true);
            xhr.responseType = 'arraybuffer';
            xhr.addEventListener('error', function () {
                // TODO: Handle Error
            });
            xhr.addEventListener('load', function () {
                callback(xhr.response);
            });
            xhr.send();
        };

        // Math Utilities
        /**
         * Math Utilities
         * @type {{Number}}
         */
        utils.math = {};
        /**
         * Calculate Note Duration based on Beats Per Minute
         * @param bpm
         * @returns {number}
         */
        utils.math.calculateNoteTime = function (bpm) {
            console.log('note duration per 16th note is', bpm / (60 * 16))
            return bpm / (60 * 16);
        };

        /**
         * Create View Elements
         * @type {{}}
         */
        sequencer.render = {};
        /**
         * Draw the project UI
         */
        sequencer.render.project = function () {
            var container = document.getElementsByTagName('seq-project')[0];

            // destroy previous view
            while (container.firstChild) {
                container.removeChild(container.lastChild);
            }

            sequencer.render.projectTitle();
            sequencer.render.projectAuthor();

            var tracks = sequencer.project.state.activeProject.Tracks,
                tracksLength = tracks.length;
            var i = 0;
            for (i; i < tracksLength; ++i) {
                sequencer.render.track(tracks[i]);
            }
        };
        /**
         * Draws Project Title
         */
        sequencer.render.projectTitle = function () {
            var container = document.getElementsByTagName('seq-project')[0],
                titleElement = document.createElement('seq-project-title'),
                titleText = document.createTextNode(sequencer.project.config.title);

            titleElement.appendChild(titleText);
            container.appendChild(titleElement);
        };
        /**
         * Draws Project Author
         */
        sequencer.render.projectAuthor = function () {
            var container = document.getElementsByTagName('seq-project')[0],
                authorElement = document.createElement('seq-project-author'),
                authorText = document.createTextNode(sequencer.project.config.author);

            authorElement.appendChild(authorText);
            container.appendChild(authorElement);
        };

        /**
         * Draws a track with note trays, and populates notes if present in event list
         * @param trackConfig
         */
        sequencer.render.track = function (trackConfig) {
            var trackContainer = document.getElementsByTagName('seq-project')[0],
                track = document.createElement('seq-track'),
                trackLabel = document.createElement('seq-track-label'),
                trackLabelContent = document.createTextNode(trackConfig.TrackName);

            trackContainer.appendChild(track);
            track.appendChild(trackLabel);
            track.trackData = trackConfig;
            trackLabel.style.gridColumnStart = 1;
            trackLabel.style.gridColumnEnd = 1;
            trackLabel.appendChild(trackLabelContent);
            sequencer.render.noteTrays(track);
            sequencer.render.notes(track, trackConfig.Events);
        };

        /**
         * Draws Note Trays (empty note slots)
         * @param {Object} track target track
         */
        sequencer.render.noteTrays = function (track) {
            var i = 2; // account for label column
            for (i; i <= 65; ++i) { // index starts at 1
                var tray = document.createElement('seq-note-tray');
                tray.sequencePosition = i - 1;
                tray.style.gridColumnStart = i;
                tray.style.gridColumnEnd = i;
                tray.addEventListener('click',
                    /**
                     * Creates a note
                     * @param event click event
                     */
                    function (event) {
                        if (sequencer.project.state.activeNote !== null) {
                            sequencer.edit.setNoteEventLength(event.currentTarget, track);
                        } else {
                            sequencer.edit.createNoteEvent(track, event.currentTarget.sequencePosition);
                        }
                    }, false);
                track.appendChild(tray);
            }
        };
        /**
         * Draws notes present in events list for a specified track
         * @param {Object} track target track
         * @param {Array} noteEvents note event details [start,end,pitch]
         */
        sequencer.render.notes = function (track, noteEvents) {

            var noteEventLength = noteEvents.length;
            var i = 0;
            for (i; i < noteEventLength; ++i) {
                var noteData = noteEvents[i].split(':');
                var note = document.createElement('seq-note');
                var noteContent = document.createTextNode(noteData[2].charAt(0));
                note.appendChild(noteContent);
                note.style.gridColumnStart = parseInt(noteData[0]) + 1;
                note.style.gridColumnEnd = parseInt(noteData[0]) + parseInt(noteData[1]) + 1;
                note.noteEvent = noteEvents[i]
                note.track = track;
                note.addEventListener('dblclick',
                    /**
                     * Selects a note
                     * @param event double click event
                     */
                    function (event) {
                        if (sequencer.project.state.activeNote !== null ||
                            (sequencer.project.state.activeNote === event.currentTarget &&
                                sequencer.project.state.activeNote !== null)) {
                            sequencer.project.state.activeNote.classList.remove('selected');
                            sequencer.project.state.activeNote = null;
                        } else {
                            sequencer.project.state.activeNote = event.currentTarget;
                            event.currentTarget.classList.add('selected');
                        }
                    }, false);
                note.pitchShift = noteData[2];
                track.appendChild(note);
            }
        };

        /**
         * Methods for editing the sequence
         * @type {{}}
         */
        sequencer.edit = {};

        /**
         * Insert a note to the project event list
         * @param track
         * @param position
         */
        sequencer.edit.createNoteEvent = function (track, position) {
            var defaultDuration = 1, defaultPitch = 0;
            track.trackData.Events.push(position + ':' + defaultDuration + ":" + defaultPitch);
            sequencer.render.project();
        };

        /**
         * Sets a notes length in the project event list based on selection
         * @param target
         */
        sequencer.edit.setNoteEventLength = function (target, track) {
            var targetEvent = track.trackData.Events.indexOf(sequencer.project.state.activeNote.noteEvent);
            var event = sequencer.project.state.activeNote.noteEvent.split(':');

            if (target.sequencePosition > event[0]) {
                track.trackData.Events[targetEvent] = event[0] + ':' + ((target.sequencePosition - event[0]) + 1) + ':' + event[2];
                sequencer.project.state.activeNote = null;
                sequencer.render.project();
            }
        };

        sequencer.edit.setNoteEventPitch = function (target, track, pitch) {
            var targetEvent = track.trackData.Events.indexOf(target.noteEvent);
            var event = target.noteEvent.split(':');
            track.trackData.Events[targetEvent] = event[0] + ':' + event[1] + ':' + pitch;
            sequencer.project.state.activeNote = null;
            sequencer.render.project();
        };

        /**
         * remove a note event based on event signature match
         */
        sequencer.edit.deleteNoteEvent = function () {
            if (sequencer.project.state.activeNote !== null) {
                var targetEvent =
                    sequencer.project.state.activeNote.track.trackData.Events.indexOf(sequencer.project.state.activeNote.noteEvent);
                sequencer.project.state.activeNote.track.trackData.Events.splice([targetEvent], 1);
                sequencer.project.state.activeNote = null;
                sequencer.render.project();
            }
        };

        sequencer.audio = {};
        sequencer.audio.audioContext = new AudioContext();

        sequencer.audio.nodes = {};
        sequencer.audio.nodes.compressor = sequencer.audio.audioContext.createDynamicsCompressor();
        sequencer.audio.nodes.compressor.threshold.value = -30;
        sequencer.audio.nodes.compressor.knee.value = 40;
        sequencer.audio.nodes.compressor.ratio.value = 6;
        sequencer.audio.nodes.compressor.attack.value = 0;
        sequencer.audio.nodes.compressor.release.value = 0.4;

        sequencer.audio.nodes.masterVolume = sequencer.audio.audioContext.createGain();
        sequencer.audio.nodes.masterVolume.value = 1;

        sequencer.audio.nodes.masterVolume.connect(sequencer.audio.audioContext.destination);
        sequencer.audio.nodes.compressor.connect(sequencer.audio.nodes.masterVolume);

        //store loaded sample buffers by name
        sequencer.audio.sampleBuffers = {};

        sequencer.audio.loadSample = function (sampleURI, sampleName) {
            utils.net.loadSample(sampleURI, function (response) {
                sequencer.audio.audioContext.decodeAudioData(response, function (buffer) {
                    sequencer.audio.sampleBuffers[sampleName] = buffer;
                }, function () {
                    //TODO: handle decode error here
                })
            })
        };

        sequencer.audio.loadAllSamples = function () {
            var samples = sequencer.project.state.activeProject.SampleSet;
            for (var sample in samples) {
                if (samples.hasOwnProperty(sample)) {
                    sequencer.audio.loadSample(samples[sample], sample);
                }
            }
        };

        sequencer.audio.playSample = function (sample, preDelay, duration, pitch) {
            //TODO: handle both oscillators and samples
            var beatLength = utils.math.calculateNoteTime(sequencer.project.state.activeProject.ProjectBPM);
            duration = duration || 1;
            preDelay = preDelay || 0;

            // NOTE:  buffersSources can only be played once so make a new one each time
            var playbackBuffer = sequencer.audio.audioContext.createBufferSource();
            var gainNode = sequencer.audio.audioContext.createGain();

            playbackBuffer.buffer = sequencer.audio.sampleBuffers[sample];
            playbackBuffer.detune.value = pitch;
            playbackBuffer.connect(gainNode);
            playbackBuffer.start(sequencer.audio.audioContext.currentTime + (preDelay * beatLength));
            playbackBuffer.stop(sequencer.audio.audioContext.currentTime + ((preDelay * beatLength) + (duration * beatLength)));

            // KILL THE CLICK!!!
            //TODO: Tweak the timing of this ramp to improve quality

            gainNode.gain.setValueAtTime(gainNode.gain.value, sequencer.audio.audioContext.currentTime + ((preDelay * beatLength) + (duration * beatLength) - (beatLength / 10)));
            gainNode.gain.exponentialRampToValueAtTime(0.0001, (sequencer.audio.audioContext.currentTime + ((preDelay * beatLength) + (duration * beatLength))));
            gainNode.connect(sequencer.audio.nodes.compressor)
        };

        sequencer.audio.playSequence = function (trackSet, loop) {

            console.log(trackSet);

            if (loop === true) {
                //TODO: Handle Looping of Sequence, probably with a timer event to cycle at 64*beatLength possibly with a setInterval in loopTimer state property
            }
            for (var i = 0; i < trackSet.length; ++i) {
                // uncomment the next line to see details of the sequence in the console
                console.log('play samples for', trackSet[i].trackName, 'using sample', trackSet[i].trackSample, 'this track has', trackSet[i].Events.length, 'events');
                for (var n = 0; n < trackSet[i].Events.length; ++n) {
                    var eventData = trackSet[i].Events[n].split(':');
                    sequencer.audio.playSample(trackSet[i].TrackSample, eventData[0], eventData[1], eventData[2]);
                }
                console.log(eventData);
            }
        };

        /**
         * Initialize Sequencer
         */
        sequencer.init = function () {
            utils.net.loadSequence('app/projects/assets/test-project.json', function (response) {
                sequencer.project.state.activeProject = JSON.parse(response);
                sequencer.project.config.author = sequencer.project.state.activeProject.ProjectAuthor;
                sequencer.project.config.title = sequencer.project.state.activeProject.ProjectName;
                sequencer.project.config.bpm = sequencer.project.state.activeProject.ProjectBPM;
                sequencer.audio.loadAllSamples();
                sequencer.render.project();
            })
        };

        ////////////////////// EVENT HANDLERS!!! //////////
        document.addEventListener('DOMContentLoaded', sequencer.init, false);

        /**
         * Capture Keyboard Events for NonPrintable Chars (ex. Delete, function keys)
         */
        window.addEventListener('keyup', function (event) {
            //NOTE: Firefox has default navigation actions so these wont work see below for alternatives
            if (event.keyCode === 46) { sequencer.edit.deleteNoteEvent(); } // Delete Key
            if (event.keyCode === 8) { sequencer.edit.deleteNoteEvent(); }  // Backspace Key (Delete on Mac)


            // Alternate Delete and Play keys, mainly for Firefox Browsers
            if (event.keyCode === 37) { //delete with <- for Firefox
                sequencer.edit.deleteNoteEvent();
            }
            if (event.keyCode === 39) { //play with -> for Firefox
                sequencer.audio.playSequence(sequencer.project.state.activeProject.Tracks);
            }

        });

        /**
         * Capture Keyboard Events for printable chars (ex A-Z,1-0, etc)
         */
        window.addEventListener('keypress', function (event) {
            // !!!NOTE: Period has the keyCode 46 on KeyPress and 190 on KeyUp this is important to pay
            // attention to due to the delete key having 46 as a keyCode on keyUp.

            function setPitch(pitch) {
                if (sequencer.project.state.activeNote !== null && pitch) {
                    console.log('setting pitch');
                    sequencer.edit.setNoteEventPitch(
                        sequencer.project.state.activeNote, sequencer.project.state.activeNote.track, pitch);
                }
            }

            if (event.keyCode === 122) { setPitch(100); }    // lowecase z
            if (event.keyCode === 120) { setPitch(200); }    // lowercase x
            if (event.keyCode === 99) { setPitch(300); }    // lowercase c
            if (event.keyCode === 118) { setPitch(400); }    // lowercase v
            if (event.keyCode === 98) { setPitch(500); }    // lowercase b
            if (event.keyCode === 110) { setPitch(600); }    // lowercase n
            if (event.keyCode === 109) { setPitch(800); }    // lowercase m
            if (event.keyCode === 44) { setPitch(900); }    // ,
            if (event.keyCode === 46) { setPitch(1000); }   // .
            if (event.keyCode === 47) { setPitch(1100); }   // /   -- =( 100 cents short of an octave

            if (event.keyCode === 32) { //spacebar - trigger playback NOTE: doesn't work in Firefox due to default action

                sequencer.audio.playSequence(sequencer.project.state.activeProject.Tracks, 2);
            }


        });

        // touch event to try playback on Mobile
        window.addEventListener('touchend', function () {
            sequencer.audio.playSequence(sequencer.project.state.activeProject.Tracks);
        });

        sequencer.init();


        $record.click(function () {
            console.log(startTime);
            if (startTime != null)
                stopRecording(true);
            else
                startRecording(sequencer.audio.audioContext);
        });
    }
})();