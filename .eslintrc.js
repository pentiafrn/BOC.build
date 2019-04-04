module.exports = {
    "env": {
        "browser": true,
        "node": true
    },
    "extends": "airbnb-base",
    "parser": "babel-eslint",
	"rules": {
        "no-cond-assign": ["error", "except-parens"],
        
        // Use tabs for indention
        "indent": ["error", "tab"],
        "no-tabs": 0,

        // Use debug() for log comments, but allow to use warn and error.
        "no-console": ["error", { "allow": ["warn", "error"] }],
        
        "linebreak-style": ["error", "windows"],
		"import/no-extraneous-dependencies": ["warn", {"devDependencies": true, "optionalDependencies": false, "peerDependencies": false}],
		"import/prefer-default-export": 0,
		"prefer-template": 0,
		"no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
        "no-void": 0,
        "comma-dangle": 0,
        "function-paren-newline": 0
    },
    "overrides": [
        {
            "files": [ "**/*.{spec,test}.js" ],
            "env": {
                "jest": true
            }
        }
      ]
};