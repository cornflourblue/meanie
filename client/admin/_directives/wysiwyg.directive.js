(function () {
    'use strict';

    angular
        .module('app')
        .directive('wysiwyg', Directive);

    function Directive($rootScope) {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                var editorOptions;
                if (attr.wysiwyg === 'minimal') {
                    // minimal editor
                    editorOptions = {
                        height: 100,
                        toolbar: [
                            { name: 'basic', items: ['Bold', 'Italic', 'Underline'] },
                            { name: 'links', items: ['Link', 'Unlink'] },
                            { name: 'tools', items: ['Maximize'] },
                            { name: 'document', items: ['Source'] },
                        ],
                        removePlugins: 'elementspath',
                        resize_enabled: false,
                        allowedContent: true
                    };
                } else {
                    // regular editor
                    editorOptions = {
                        filebrowserImageUploadUrl: '/admin/upload',
                        removeButtons: 'About,Form,Checkbox,Radio,TextField,Textarea,Select,Button,ImageButton,HiddenField,Save,CreateDiv,Language,BidiLtr,BidiRtl,Flash,Iframe,addFile,Styles',
                        allowedContent: true
                    };
                }

                // enable ckeditor
                var ckeditor = element.ckeditor(editorOptions);

                // update ngModel on change
                ckeditor.editor.on('change', function () {
                    ngModel.$setViewValue(this.getData());
                });
            }
        };
    }
})();