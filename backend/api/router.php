<?php
class Router
{
    /**
     * @var array $routes Stores all registered routes.
     */
    private static array $routes = [
        //will likely need changing for deployment
        "backend/api/login"=>"login.php",
        "backend/api/register"=>"register.php",
        "backend/api/register/{id}"=>"register.php",
        "backend/api/work_done"=>"work_done.php",
        "backend/api/work_done/{id}"=>"work_done.php",
        "backend/api/report/client"=>"client.php",
        "backend/api/report/client/{id}"=>"client.php",
        "backend/api/report/client_work/{id}"=>"client_work_done.php",
        "backend/api/report/client_rates"=>"client_rates.php",
        "backend/api/report/staff"=>"staff.php",
        "backend/api/report/staff/{id}"=>"staff_work_done.php",
        "backend/api/report/income"=>"income.php",
        "backend/api/report/income/{id}"=>"income.php",
        "backend/api/mailer"=>"mailer.php",
        "backend/api/mailer/micro_acc/{id}"=>"micro_acc.php",
        "backend/api/client_mail/{id}"=>"client_mail.php",
        "backend/api/task"=>"tasks.php",
        "backend/api/task/members"=>"tasks_member.php",
        "backend/api/task/new"=>"task_new.php",
        "backend/api/task/{id}"=>"tasks.php",
        "backend/api/task/members/{id}"=>"tasks_member.php",
        "backend/api/task/{id}/{employee}"=>"tasks_member.php",

    ];
    public static array $route_params=[];
    /**
     * Resolve the current request to the corresponding route action.
     * 
     */
    public static function dispatch()
    {
        $requestedRoute = trim($_SERVER['REQUEST_URI'], '/') ?? '/';
        $requestedRoute=explode('?',$requestedRoute)[0];

        foreach (self::$routes as $route => $file)
        {
            // Transform route to regex pattern.
            $routeRegex = preg_replace_callback('/{\w+(:([^}]+))?}/', function ($matches)
            {
                return isset($matches[1]) ? '(' . $matches[2] . ')' : '([a-zA-Z0-9_-]+)';
            }, $route);
            $routeRegex = '@^' . $routeRegex . '$@';

            if (preg_match($routeRegex, $requestedRoute, $matches))
            {
                // Get all user requested path params values after removing the first matches.
                array_shift($matches);
                $routeParamsValues = $matches;

                $routeParamsNames = [];
                if (preg_match_all('/{(\w+)(:[^}]+)?}/', $route, $matches))
                {
                    $routeParamsNames = $matches[1];
                }
                self::$route_params= array_combine($routeParamsNames, $routeParamsValues);
                require $file;
            }
        }
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
        http_response_code(404);
        echo json_encode(["message"=>"Resource doesn't exist"]);
        exit();
    }
}

?>