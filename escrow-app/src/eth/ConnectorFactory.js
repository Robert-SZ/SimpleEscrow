import EtheriumConnector from './EtheriumConnector'

export default class ConnectorFactory {
    getConnector() {
        return new EtheriumConnector();
    }
}