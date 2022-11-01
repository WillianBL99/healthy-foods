/* const types: Types = {
  Middleware: 'magenta',
  Controller: 'green',
  Repository: 'blue',
  Database: 'blue',
  Server: 'yellow',
  Service: 'cyan',
  Error: 'red',
}; */

const AppLog = (
  type:
    | 'Middleware'
    | 'Controller'
    | 'Repository'
    | 'Database'
    | 'Server'
    | 'Service'
    | 'Error',
  text: string | any
) => {
/*   const color = types[type] as
    | 'green'
    | 'magenta'
    | 'blue'
    | 'yellow'
    | 'cyan'
    | 'red'; */


  console.log(`[${type}]`, text);
  if (text.detail) {
    console.log(text.detail);
  }
};

export default AppLog;
