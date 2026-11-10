
                                    function updateZgibanjeDefaults() {
                                        let folds = parseInt(document.getElementById('f-zgibanje-folds').value) || 1;
                                        let speedInput = document.getElementById('f-zgibanje-speed');
                                        if (folds === 1) speedInput.value = 10800;
                                        else if (folds === 2) speedInput.value = 8500;
                                        else if (folds === 3) speedInput.value = 7500;
                                        else if (folds === 4) speedInput.value = 5750;
                                        else if (folds === 5) speedInput.value = 4500;
                                    }
                                