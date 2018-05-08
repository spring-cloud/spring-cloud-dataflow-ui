import { ConfigurationMetadataProperty,
         Deprecation,
         DetailedAppRegistration } from './detailed-app-registration.model';
import { ApplicationType } from './application-type';

describe('DetailedAppRegistration', () => {

  describe('ConfigurationMetadataProperty', () => {
    describe('deserialize', () => {
      it('should deserialize a json object into a ConfigurationMetadataProperty object', () => {
        const jsonConfigurationMetadataProperty = JSON.parse(`
          {
            "id": "log.name",
            "name": "name",
            "type": "java.lang.String",
            "description": "The name of the logger to use.",
            "shortDescription": "This is a short description",
            "defaultValue": null,
            "hints":
            {
                "keyHints":
                [
                ],
                "keyProviders":
                [
                ],
                "valueHints":
                [
                ],
                "valueProviders":
                [
                ]
            },
            "deprecation": null,
            "sourceType": "org.springframework.cloud.stream.app.log.sink.LogSinkProperties",
            "sourceMethod": null,
            "deprecated": false
          }
        `);

        const configurationMetadataProperty = new ConfigurationMetadataProperty().deserialize(jsonConfigurationMetadataProperty);
        expect(configurationMetadataProperty.defaultValue).toBe(undefined);
        expect(configurationMetadataProperty.isDeprecated).toBe(false);
        expect(configurationMetadataProperty.description).toEqual('The name of the logger to use.');
        expect(configurationMetadataProperty.shortDescription).toEqual('This is a short description');
        expect(configurationMetadataProperty.id).toEqual('log.name');
        expect(configurationMetadataProperty.name).toEqual('name');
        expect(configurationMetadataProperty.type).toEqual('java.lang.String');
      });
    });
  });

  describe('Deprecation', () => {
    describe('deserialize', () => {
      it('should deserialize a json object into a Deprecation object', () => {
        const jsonDeprecation = JSON.parse(`
          {
            "level": "WARNING",
            "reason": "Great reason",
            "replacement": "Use something else"
          }
        `);

        const deprecation = new Deprecation().deserialize(jsonDeprecation);
        expect(deprecation.level).toEqual('WARNING');
        expect(deprecation.reason).toEqual('Great reason');
        expect(deprecation.replacement).toEqual('Use something else');
      });
    });
  });

  describe('deserialize', () => {
    it('should deserialize a json object into a AppRegistration object', () => {
      const jsonDetailedAppRegistration = JSON.parse(`
        {
          "name": "log",
          "type": "sink",
          "uri": "maven://org.springframework.cloud.stream.app:log-sink-rabbit:1.2.0.RELEASE",
          "options":
          [
              {
                  "id": "log.name",
                  "name": "name",
                  "type": "java.lang.String",
                  "description": "The name of the logger to use.",
                  "shortDescription": "The name of the logger to use.",
                  "defaultValue": null,
                  "hints":
                  {
                      "keyHints":
                      [
                      ],
                      "keyProviders":
                      [
                      ],
                      "valueHints":
                      [
                      ],
                      "valueProviders":
                      [
                      ]
                  },
                  "deprecation": null,
                  "sourceType": "org.springframework.cloud.stream.app.log.sink.LogSinkProperties",
                  "sourceMethod": null,
                  "deprecated": false
              },
              {
                  "id": "log.level",
                  "name": "level",
                  "type": "org.springframework.integration.handler.LoggingHandler$Level",
                  "description": "The level at which to log messages.",
                  "shortDescription": "The level at which to log messages.",
                  "defaultValue": null,
                  "hints":
                  {
                      "keyHints":
                      [
                      ],
                      "keyProviders":
                      [
                      ],
                      "valueHints":
                      [
                      ],
                      "valueProviders":
                      [
                      ]
                  },
                  "deprecation": {
                    "level": "WARNING",
                    "reason": "Number 2",
                    "replacement": "Replace Number 2"
                  },
                  "sourceType": "org.springframework.cloud.stream.app.log.sink.LogSinkProperties",
                  "sourceMethod": null,
                  "deprecated": true
              },
              {
                  "id": "log.expression",
                  "name": "expression",
                  "type": "java.lang.String",
                  "description": "A SpEL expression (against the incoming message) to evaluate as the logged message.",
                  "shortDescription": "A SpEL expression (against the incoming message) to evaluate as the logged message.",
                  "defaultValue": "payload",
                  "hints":
                  {
                      "keyHints":
                      [
                      ],
                      "keyProviders":
                      [
                      ],
                      "valueHints":
                      [
                      ],
                      "valueProviders":
                      [
                      ]
                  },
                  "deprecation": null,
                  "sourceType": "org.springframework.cloud.stream.app.log.sink.LogSinkProperties",
                  "sourceMethod": null,
                  "deprecated": false
              }
          ],
          "shortDescription": null
      }`);

      const detailedAppRegistration = new DetailedAppRegistration().deserialize(jsonDetailedAppRegistration);
      expect(detailedAppRegistration.name).toEqual('log');
      expect(detailedAppRegistration.type.toString()).toEqual(ApplicationType[ApplicationType.sink].toString());
      expect(detailedAppRegistration.uri).toEqual('maven://org.springframework.cloud.stream.app:log-sink-rabbit:1.2.0.RELEASE');
      expect(detailedAppRegistration.options.length).toBe(3);
      expect(detailedAppRegistration.options[0].deprecation).toBe(undefined);
      expect(detailedAppRegistration.options[0].isDeprecated).toBe(false);
      expect(detailedAppRegistration.options[1].isDeprecated).toBe(true);
      expect(detailedAppRegistration.options[1].deprecation.level).toEqual('WARNING');
      expect(detailedAppRegistration.options[1].deprecation.reason).toEqual('Number 2');
      expect(detailedAppRegistration.options[1].deprecation.replacement).toEqual('Replace Number 2');
    });
  });
});
